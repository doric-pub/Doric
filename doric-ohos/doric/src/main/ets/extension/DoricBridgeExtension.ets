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

import { DoricContextManager } from '../DoricContext'
import { DoricPromise } from '../plugin/DoricPromise'
import { DoricNativePlugin, DoricThreadMode } from '../plugin/DoricNativePlugin'
import { DoricRegistry } from '../DoricRegistry'
import { DoricShaderPlugin } from '../plugin/DoricShaderPlugin'
import { DoricScrollerNode } from '../shader/DoricScrollerNode'
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
   */
  private static registerBuiltinPlugins(): void {
    const registry = DoricRegistry.getInstance()

    // Register ShaderPlugin (module name = "shader")
    registry.registerNativePlugin('shader', (context) => new DoricShaderPlugin(context))

    // Register built-in view nodes
    registry.registerViewNode('Scroller', (context) => {
      const node = new DoricScrollerNode(context)
      node.type = 'Scroller'
      node.nodeModel.type = 'Scroller'
      return node
    })

    hilog.info(DOMAIN, TAG, 'Built-in plugins registered')
  }

  /**
   * Handle a native bridge call from JS.
   */
  callNative(contextId: string, module: string, method: string,
    callbackId: string, argument: string): void {
    hilog.debug(DOMAIN, TAG,
      'callNative: ctx=%{public}s mod=%{public}s method=%{public}s cb=%{public}s',
      contextId, module, method, callbackId)

    // 1. Get the context
    const context = DoricContextManager.getInstance().getContext(contextId)
    if (context === undefined || context.destroyed) {
      hilog.warn(DOMAIN, TAG, 'callNative: context not found or destroyed: %{public}s', contextId)
      return
    }

    // 2. Create the promise (pass context ref for destroyed check)
    const promise = new DoricPromise(contextId, callbackId, context)

    // 3. Find or create the plugin instance
    const registry = DoricRegistry.getInstance()
    const pluginFactory = registry.acquireNativePlugin(module)

    if (pluginFactory === undefined) {
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
    const threadMode = plugin.threadMode(method)

    if (threadMode === DoricThreadMode.UI) {
      this.dispatchPluginMethod(plugin, method, argument, promise)
    } else if (threadMode === DoricThreadMode.JS) {
      this.dispatchPluginMethod(plugin, method, argument, promise)
    } else {
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
