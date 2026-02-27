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

import {
  prepareContext,
  destroyContext,
  callEntityMethod
} from 'libdoric.so'
import { DoricNavigatorDelegate, DoricNavBarDelegate, DoricStatusBarDelegate } from './DoricDelegates'
import { DoricContextRef, DoricRootNode, DoricViewNode } from './DoricViewNode'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricContext'
const DOMAIN = 0x8000

/**
 * DoricContextManager - Manages all active DoricContext instances.
 *
 * Aligned with iOS DoricContextManager.
 */
export class DoricContextManager {
  private static instance_: DoricContextManager | undefined = undefined
  private counter_: number = 0
  private contextMap_: Map<string, DoricContext> = new Map()

  static getInstance(): DoricContextManager {
    if (!DoricContextManager.instance_) {
      DoricContextManager.instance_ = new DoricContextManager()
    }
    return DoricContextManager.instance_!
  }

  /**
   * Create and register a new context. Returns the allocated contextId.
   */
  createContext(context: DoricContext, script: string, source: string): string {
    this.counter_++
    const contextId = this.counter_.toString()
    context.contextId = contextId
    this.contextMap_.set(contextId, context)
    prepareContext(contextId, script, source)
    return contextId
  }

  /**
   * Destroy and unregister a context by id.
   */
  destroyContext(context: DoricContext): void {
    const contextId = context.contextId
    this.contextMap_.delete(contextId)
    destroyContext(contextId)
  }

  /**
   * Get a context by its id.
   */
  getContext(contextId: string): DoricContext | undefined {
    return this.contextMap_.get(contextId)
  }

  /**
   * Get all alive contexts.
   */
  getAliveContexts(): DoricContext[] {
    const result: DoricContext[] = []
    this.contextMap_.forEach((ctx) => {
      result.push(ctx)
    })
    return result
  }
}

/**
 * Initial params for context build, aligned with iOS initialParams dictionary.
 */
class DoricInitialParams {
  width: number = 0
  height: number = 0
}

/**
 * DoricContext - Execution context for a single Doric panel.
 *
 * Aligned with iOS DoricContext:
 *   - contextId: unique identifier
 *   - source: script source identifier
 *   - script: raw JS script content
 *   - extra: initialization extra data (JSON string)
 *   - rootNode: the root of the view tree
 *   - headNodes: dictionary of head-level node maps (for popover, etc.)
 *   - pluginInstanceMap: cached plugin instances
 *   - navigator / navBar / statusBar delegates
 *   - callEntity: invoke JS entity methods
 *   - targetViewNode: find a view node by ID
 *   - build / onShow / onHidden / onEnvChanged lifecycle
 */
export class DoricContext implements DoricContextRef {
  contextId: string = ''
  source: string = ''
  script: string = ''
  extra: string = ''
  destroyed: boolean = false

  /** Delegate references - aligned with iOS weak properties */
  navigator: DoricNavigatorDelegate | undefined = undefined
  navBar: DoricNavBarDelegate | undefined = undefined
  statusBar: DoricStatusBarDelegate | undefined = undefined

  /**
   * Root node of the view tree.
   * Aligned with iOS: @property(nonatomic, strong) DoricRootNode *rootNode;
   * Aligned with Android: private RootNode mRootNode;
   */
  rootNode: DoricRootNode

  /**
   * Head-level nodes map (for popover, overlays, etc.).
   * Keyed by type name, then by viewId.
   * Aligned with iOS: @property(nonatomic, strong) NSMutableDictionary<NSString *, NSMutableDictionary<NSString *, DoricViewNode *> *> *headNodes;
   */
  private headNodes_: Map<string, Map<string, DoricViewNode>> = new Map()

  /**
   * Cached plugin instances keyed by module name.
   * Aligned with iOS: @property(nonatomic, strong) NSMutableDictionary *pluginInstanceMap;
   * Aligned with Android: HashMap<String, DoricJavaPlugin> mPluginMap;
   */
  private pluginInstanceMap_: Map<string, Object> = new Map()

  /** Initial params for build, aligned with iOS initialParams */
  private initialParams_: DoricInitialParams = new DoricInitialParams()

  /**
   * Create a new DoricContext.
   * Aligned with iOS: initWithScript:source:extra:
   */
  constructor(script: string, source: string, extra?: string) {
    this.script = script
    this.source = source

    // Create root node
    // Aligned with iOS: DoricRootNode *rootNode = [[DoricRootNode alloc] initWithContext:self];
    this.rootNode = new DoricRootNode(this)

    // Register with the context manager (this also calls prepareContext on native)
    DoricContextManager.getInstance().createContext(this, script, source)

    // Init and trigger __onCreate__
    if (extra !== undefined && extra.length > 0) {
      this.extra = extra
      this.callEntity('__init__', extra)
    }
    this.callEntity('__onCreate__')
  }

  /**
   * Invoke a method on this context's JS entity.
   * Aligned with iOS: - (DoricAsyncResult *)callEntity:(NSString *)method withArgumentsArray:(NSArray *)args;
   */
  callEntity(method: string, ...args: (string | number | boolean)[]): string {
    if (this.destroyed) {
      return ''
    }
    return callEntityMethod(this.contextId, method, ...args)
  }

  /**
   * Build the panel with the given size.
   * Aligned with iOS: - (void)build:(CGSize)size;
   */
  build(width: number, height: number): void {
    this.initialParams_.width = width
    this.initialParams_.height = height
    this.callEntity('__build__', JSON.stringify(this.initialParams_))
  }

  /**
   * Notify the context that it is being shown.
   * Aligned with iOS: - (void)onShow;
   */
  onShow(): void {
    this.callEntity('__onShow__')
  }

  /**
   * Notify the context that it is being hidden.
   * Aligned with iOS: - (void)onHidden;
   */
  onHidden(): void {
    this.callEntity('__onHidden__')
  }

  /**
   * Notify the context that environment has changed.
   * Aligned with iOS: - (void)onEnvChanged;
   */
  onEnvChanged(): void {
    this.callEntity('__onEnvChanged__')
  }

  /**
   * Find a view node by its viewId.
   *
   * Aligned with iOS:
   *   - (DoricViewNode *)targetViewNode:(NSString *)viewId;
   *   Logic: first check rootNode, then check all headNodes maps.
   *
   * Aligned with Android:
   *   public ViewNode<?> targetViewNode(String id)
   */
  targetViewNode(viewId: string): DoricViewNode | undefined {
    // Check root node first
    if (this.rootNode.viewId === viewId) {
      return this.rootNode
    }
    // Check head nodes (popover, overlays, etc.)
    let found: DoricViewNode | undefined = undefined
    this.headNodes_.forEach((nodeMap: Map<string, DoricViewNode>) => {
      if (found === undefined) {
        const node = nodeMap.get(viewId)
        if (node !== undefined) {
          found = node
        }
      }
    })
    return found
  }

  /**
   * Register a head-level node (for popover, overlays, etc.).
   * Aligned with iOS: self.headNodes[type][viewId] = node;
   */
  addHeadNode(type: string, node: DoricViewNode): void {
    let nodeMap = this.headNodes_.get(type)
    if (nodeMap === undefined) {
      nodeMap = new Map()
      this.headNodes_.set(type, nodeMap)
    }
    nodeMap.set(node.viewId, node)
  }

  /**
   * Remove a head-level node.
   */
  removeHeadNode(type: string, viewId: string): void {
    const nodeMap = this.headNodes_.get(type)
    if (nodeMap !== undefined) {
      nodeMap.delete(viewId)
    }
  }

  /**
   * Get all head nodes of a given type.
   */
  getHeadNodes(type: string): Map<string, DoricViewNode> | undefined {
    return this.headNodes_.get(type)
  }

  /**
   * Get a cached plugin instance.
   */
  getPlugin(module: string): Object | undefined {
    return this.pluginInstanceMap_.get(module)
  }

  /**
   * Cache a plugin instance.
   */
  setPlugin(module: string, plugin: Object): void {
    this.pluginInstanceMap_.set(module, plugin)
  }

  /**
   * Reload with a new script.
   * Aligned with iOS: - (void)reload:(NSString *)script;
   */
  reload(script: string): void {
    // Destroy old context at native level
    destroyContext(this.contextId)

    this.script = script
    this.destroyed = false

    // Reset root node
    this.rootNode.viewId = ''
    this.rootNode.clearSubModel()

    // Clear plugin cache
    this.pluginInstanceMap_.clear()

    // Re-prepare at native level
    prepareContext(this.contextId, script, this.source)

    // Re-init
    if (this.extra.length > 0) {
      this.callEntity('__init__', this.extra)
    }
    this.callEntity('__onCreate__')
    this.build(this.initialParams_.width, this.initialParams_.height)
    this.onShow()
  }

  /**
   * Destroy this context and release resources.
   * Aligned with iOS: dealloc
   */
  teardown(): void {
    if (this.destroyed) {
      return
    }
    this.destroyed = true
    this.callEntity('__onDestroy__')
    this.pluginInstanceMap_.clear()
    this.headNodes_.clear()
    DoricContextManager.getInstance().destroyContext(this)
  }
}
