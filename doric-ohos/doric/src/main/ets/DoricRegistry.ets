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

import { DoricPluginFactory } from './plugin/DoricNativePlugin'
import { DoricViewNodeFactory, DoricViewNodeFactoryFunc } from './shader/DoricViewNode'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricRegistry'
const DOMAIN = 0x8000

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

  /**
   * Register a custom view node type.
   * External Doric libraries can use this to register their own view node types
   * that will be renderable in the Doric view tree.
   *
   * Aligned with iOS: - (void)registerViewNode:(Class)nodeClass withName:(NSString *)name;
   * Aligned with Android: registry.registerViewNode(name, nodeClass)
   *
   * @param type - The node type name (e.g., "MyCustomView")
   * @param factory - A factory function that creates the node given a context
   */
  registerViewNode(type: string, factory: DoricViewNodeFactoryFunc): void {
    DoricViewNodeFactory.register(type, factory)
    hilog.debug(DOMAIN, TAG, 'Registered ViewNode: %{public}s', type)
  }
}
