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
 * DoricPlugin - Base class for all Doric native plugins.
 *
 * Aligned with iOS DoricNativePlugin / Android DoricJavaPlugin:
 *   - Holds a reference to the DoricContext
 *   - Provides a threadMode indicator for each method
 *   - Plugin methods receive (argument, DoricPromise) and act on the context
 *
 * Plugin Registration:
 *   In OHOS, we use DoricRegistry to map module names to plugin factory functions.
 *   This replaces iOS's runtime reflection and Android's @DoricPlugin annotation.
 */
import { DoricContext } from './DoricContext'
import { DoricPromise } from './DoricPromise'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricPlugin'
const DOMAIN = 0x8000

/**
 * Thread mode enum, aligned with iOS DoricThreadMode / Android ThreadMode.
 */
export enum DoricThreadMode {
  UI = 1,
  JS = 2,
  INDEPENDENT = 3
}

/**
 * Type for plugin method handlers.
 * Each method receives the JSON argument string and a DoricPromise.
 */
export type DoricPluginMethodHandler = (argument: string, promise: DoricPromise) => void

/**
 * DoricNativePlugin - Base class for Doric plugins.
 *
 * Aligned with iOS DoricNativePlugin / Android DoricJavaPlugin.
 */
export class DoricNativePlugin {
  protected doricContext: DoricContext

  constructor(context: DoricContext) {
    this.doricContext = context
  }

  /**
   * Get the thread mode for a given method.
   * Override in subclass if needed.
   * Aligned with iOS: - (DoricThreadMode)threadMode:(NSString *)method;
   *
   * Default: INDEPENDENT (background thread)
   */
  threadMode(_method: string): DoricThreadMode {
    return DoricThreadMode.INDEPENDENT
  }

  /**
   * Dispatch a method call. Subclasses register their methods via getMethodMap().
   * Returns true if the method was found and dispatched.
   */
  callMethod(method: string, argument: string, promise: DoricPromise): boolean {
    const methodMap = this.getMethodMap()
    const handler = methodMap.get(method)
    if (handler !== undefined) {
      try {
        handler(argument, promise)
      } catch (e) {
        hilog.error(DOMAIN, TAG, 'Plugin method error: %{public}s.%{public}s - %{public}s',
          this.constructor.name, method, (e as Error).message)
        promise.reject(JSON.stringify((e as Error).message))
      }
      return true
    }
    return false
  }

  /**
   * Get the method handler map. Subclasses should override this to register their methods.
   * Aligned with iOS runtime method lookup / Android @DoricMethod annotation.
   */
  getMethodMap(): Map<string, DoricPluginMethodHandler> {
    return new Map()
  }
}

/**
 * Plugin factory function type.
 * Creates a plugin instance given a DoricContext.
 */
export type DoricPluginFactory = (context: DoricContext) => DoricNativePlugin

/**
 * DoricRegistry - Registry for native plugins and view nodes.
 *
 * Aligned with iOS DoricRegistry / Android DoricRegistry:
 *   - registerNativePlugin: maps module name -> plugin factory
 *   - acquireNativePlugin: retrieves the factory for a module
 *
 * In OHOS, since we don't have runtime reflection like Objective-C,
 * plugins must be explicitly registered via factory functions.
 */
export class DoricRegistry {
  private static instance_: DoricRegistry | undefined = undefined

  /** Plugin factories keyed by module name */
  private pluginFactories_: Map<string, DoricPluginFactory> = new Map()

  static getInstance(): DoricRegistry {
    if (!DoricRegistry.instance_) {
      DoricRegistry.instance_ = new DoricRegistry()
    }
    return DoricRegistry.instance_!
  }

  /**
   * Register a native plugin factory.
   * Aligned with iOS: - (void)registerNativePlugin:(Class)pluginClass withName:(NSString *)name;
   * Aligned with Android: registry.registerNativePlugin(name, pluginClass)
   */
  registerNativePlugin(name: string, factory: DoricPluginFactory): void {
    this.pluginFactories_.set(name, factory)
    hilog.debug(DOMAIN, TAG, 'Registered plugin: %{public}s', name)
  }

  /**
   * Acquire a plugin factory by module name.
   * Aligned with iOS: - (Class)acquireNativePlugin:(NSString *)name;
   */
  acquireNativePlugin(name: string): DoricPluginFactory | undefined {
    return this.pluginFactories_.get(name)
  }
}
