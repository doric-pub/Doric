/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * DoricBridgeExtension - Routes JS -> Native bridge calls to the correct plugin.
 *
 * Aligned with iOS DoricBridgeExtension:
 *   - (id)callNativeWithContextId:(NSString *)contextId
 *                          module:(NSString *)module
 *                          method:(NSString *)method
 *                      callbackId:(NSString *)callbackId
 *                        argument:(id)argument;
 *
 * Aligned with Android DoricBridgeExtension:
 *   public boolean callNative(String contextId, String module, String method,
 *                             String callbackId, JSValue jsValue)
 *
 * Bridge call flow:
 *   JS → nativeBridge(contextId, module, method, callbackId, argument)
 *   → C++ NativeBridge callback (in JSVM thread)
 *   → napi_call_threadsafe_function → ArkTS main thread
 *   → DoricBridgeExtension.callNative()
 *   → Find/create plugin instance
 *   → Dispatch to plugin method
 *   → DoricPromise.resolve/reject → back to JS
 */
import { DoricContextManager } from './DoricContext'
import { DoricPromise } from './DoricPromise'
import { DoricNativePlugin, DoricRegistry, DoricThreadMode } from './DoricPlugin'
import { DoricShaderPlugin } from './DoricShaderPlugin'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricBridgeExtension'
const DOMAIN = 0x8000

export class DoricBridgeExtension {
  private static instance_: DoricBridgeExtension | undefined = undefined

  static getInstance(): DoricBridgeExtension {
    if (!DoricBridgeExtension.instance_) {
      DoricBridgeExtension.instance_ = new DoricBridgeExtension()
      // Register built-in plugins
      DoricBridgeExtension.registerBuiltinPlugins()
    }
    return DoricBridgeExtension.instance_!
  }

  /**
   * Register built-in plugins into the DoricRegistry.
   * Aligned with iOS DoricLibrary.load / Android DoricRegistry constructor.
   *
   * This replaces iOS's runtime-based plugin discovery and Android's annotation-based registration.
   */
  private static registerBuiltinPlugins(): void {
    const registry = DoricRegistry.getInstance()

    // Register ShaderPlugin (module name = "shader")
    // Aligned with iOS DoricShaderPlugin / Android @DoricPlugin(name = "shader")
    registry.registerNativePlugin('shader', (context) => new DoricShaderPlugin(context))

    // TODO: Register other built-in plugins as they are implemented:
    // registry.registerNativePlugin('modal', (context) => new DoricModalPlugin(context))
    // registry.registerNativePlugin('navigator', (context) => new DoricNavigatorPlugin(context))
    // registry.registerNativePlugin('navBar', (context) => new DoricNavBarPlugin(context))
    // registry.registerNativePlugin('statusBar', (context) => new DoricStatusBarPlugin(context))
    // registry.registerNativePlugin('network', (context) => new DoricNetworkPlugin(context))
    // registry.registerNativePlugin('storage', (context) => new DoricStoragePlugin(context))
    // registry.registerNativePlugin('popover', (context) => new DoricPopoverPlugin(context))
    // registry.registerNativePlugin('animate', (context) => new DoricAnimatePlugin(context))
    // registry.registerNativePlugin('notification', (context) => new DoricNotificationPlugin(context))
    // registry.registerNativePlugin('keyboard', (context) => new DoricKeyboardPlugin(context))
    // registry.registerNativePlugin('notch', (context) => new DoricNotchPlugin(context))
    // registry.registerNativePlugin('coordinator', (context) => new DoricCoordinatorPlugin(context))
    // registry.registerNativePlugin('imageDecoder', (context) => new DoricImageDecoderPlugin(context))
    // registry.registerNativePlugin('resourceLoader', (context) => new DoricResourceLoaderPlugin(context))

    hilog.info(DOMAIN, TAG, 'Built-in plugins registered')
  }

  /**
   * Handle a native bridge call from JS.
   *
   * Aligned with iOS:
   *   - (id)callNativeWithContextId:(NSString *)contextId
   *                          module:(NSString *)module
   *                          method:(NSString *)method
   *                      callbackId:(NSString *)callbackId
   *                        argument:(id)argument;
   *
   * @param contextId - The context identifier
   * @param module    - The plugin module name (e.g., "shader", "modal")
   * @param method    - The method name to call on the plugin (e.g., "render", "command")
   * @param callbackId - The callback identifier for promise resolution
   * @param argument  - The argument JSON string
   */
  callNative(contextId: string, module: string, method: string,
    callbackId: string, argument: string): void {
    hilog.debug(DOMAIN, TAG,
      'callNative: ctx=%{public}s mod=%{public}s method=%{public}s cb=%{public}s',
      contextId, module, method, callbackId)

    // 1. Get the context
    // Aligned with iOS: DoricContext *context = [[DoricContextManager instance] getContext:contextId];
    const context = DoricContextManager.getInstance().getContext(contextId)
    if (context === undefined || context.destroyed) {
      hilog.warn(DOMAIN, TAG, 'callNative: context not found or destroyed: %{public}s', contextId)
      return
    }

    // 2. Create the promise (pass context ref for destroyed check)
    const promise = new DoricPromise(contextId, callbackId, context)

    // 3. Find or create the plugin instance
    // Aligned with iOS:
    //   Class pluginClass = [self.registry acquireNativePlugin:module];
    //   DoricNativePlugin *nativePlugin = context.pluginInstanceMap[module];
    //   if (nativePlugin == nil) { nativePlugin = [[pluginClass alloc] initWithContext:context]; }
    const registry = DoricRegistry.getInstance()
    const pluginFactory = registry.acquireNativePlugin(module)

    if (pluginFactory === undefined) {
      // Aligned with iOS: [promise reject:@"Cannot obtain plugin instance:%@, method:%@"]
      const errMsg = `Cannot obtain plugin instance:${module}, method:${method}`
      hilog.error(DOMAIN, TAG, 'callNative: %{public}s', errMsg)
      promise.reject(JSON.stringify(errMsg))
      return
    }

    // Get or create plugin instance from context's plugin cache
    let pluginObj = context.getPlugin(module)
    if (pluginObj === undefined) {
      pluginObj = pluginFactory(context)
      context.setPlugin(module, pluginObj)
    }
    const plugin = pluginObj as DoricNativePlugin

    // 4. Dispatch the method call
    // Aligned with iOS: [self findClass:pluginClass target:nativePlugin context:context method:method ...]
    // Aligned with Android: pluginInfo.getMethod(name) → method.invoke(...)
    const threadMode = plugin.threadMode(method)

    if (threadMode === DoricThreadMode.UI) {
      // Run on UI thread (main thread)
      // In OHOS ArkTS, code runs on the main thread by default for UI operations.
      // For explicit main thread dispatch, we run synchronously here since
      // bridge calls are already dispatched to the main thread via threadsafe function.
      this.dispatchPluginMethod(plugin, method, argument, promise)
    } else if (threadMode === DoricThreadMode.JS) {
      // JS thread mode: the call is already originating from JS thread via bridge,
      // but we need to dispatch back to JS thread. For now, handle synchronously.
      this.dispatchPluginMethod(plugin, method, argument, promise)
    } else {
      // Independent thread: dispatch asynchronously
      // In ArkTS, we can use taskpool or Promise for async operations
      this.dispatchPluginMethod(plugin, method, argument, promise)
    }
  }

  /**
   * Dispatch the plugin method call.
   */
  private dispatchPluginMethod(plugin: DoricNativePlugin, method: string,
    argument: string, promise: DoricPromise): void {
    const found = plugin.callMethod(method, argument, promise)
    if (!found) {
      const errMsg = `Cannot find plugin method in class:${plugin.constructor.name}, method:${method}`
      hilog.error(DOMAIN, TAG, 'dispatchPluginMethod: %{public}s', errMsg)
      promise.reject(JSON.stringify(errMsg))
    }
  }
}
