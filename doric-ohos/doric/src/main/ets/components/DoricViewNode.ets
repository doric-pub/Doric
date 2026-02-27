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
 * DoricViewNode - Base class for all view nodes in the Doric view tree.
 *
 * Aligned with iOS DoricViewNode (inherits DoricContextHolder):
 *   - viewId: unique view identifier
 *   - type: node type name
 *   - blend(props): apply properties
 *   - requestLayout(): trigger layout update
 *   - callJSResponse(): call JS callback
 *
 * Aligned with Android ViewNode:
 *   - getId/setId
 *   - getType
 *   - blend(JSObject)
 *   - getNodeView()
 */
import { DoricPromise } from './DoricPromise'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricViewNode'
const DOMAIN = 0x8000

/**
 * Interface for DoricContext reference, avoiding circular dependency.
 * Aligned with iOS DoricContextHolder pattern.
 */
export interface DoricContextRef {
  contextId: string
  destroyed: boolean
  callEntity(method: string, ...args: (string | number | boolean)[]): string
}

/**
 * Type for ViewNode method handlers (used by command dispatch).
 */
export type DoricViewNodeMethodHandler = (argument: string, promise: DoricPromise) => void

/**
 * DoricViewNode - Base view node.
 *
 * Aligned with iOS DoricViewNode / Android ViewNode.
 */
export class DoricViewNode {
  /** Unique view ID assigned by JS side */
  viewId: string = ''
  /** Node type name (e.g., "Stack", "VLayout", "Text") */
  type: string = ''
  /** Reference to the owning DoricContext */
  doricContext: DoricContextRef
  /** Parent super node, undefined for root */
  superNode: DoricSuperNode | undefined = undefined
  /** Index in parent's children */
  index: number = 0
  /** The stored props (model) */
  protected props_: Record<string, Object> = {}

  constructor(context: DoricContextRef) {
    this.doricContext = context
  }

  /**
   * Initialize with a super node.
   * Aligned with iOS: - (void)initWithSuperNode:(DoricSuperNode *)superNode;
   */
  initWithSuperNode(superNode: DoricSuperNode): void {
    this.superNode = superNode
  }

  /**
   * Blend (merge) properties into this node.
   * Aligned with iOS: - (void)blend:(NSDictionary *)props;
   * Aligned with Android: void blend(JSObject jsObject);
   */
  blend(props: Record<string, Object>): void {
    if (props === undefined || props === null) {
      return
    }
    const keys = Object.keys(props)
    for (const key of keys) {
      this.blendProp(key, props[key])
    }
    this.afterBlended(props)
  }

  /**
   * Blend a single property. Subclasses override to handle specific properties.
   * Aligned with iOS: - (void)blendView:(V)view forPropName:(NSString *)name propValue:(id)prop;
   */
  blendProp(name: string, value: Object): void {
    this.props_[name] = value
  }

  /**
   * Called after all properties have been blended.
   * Aligned with iOS: - (void)afterBlended:(NSDictionary *)props;
   */
  afterBlended(_props: Record<string, Object>): void {
    // Override in subclasses
  }

  /**
   * Request layout update.
   * Aligned with iOS: - (void)requestLayout;
   */
  requestLayout(): void {
    // In OHOS, layout is handled by ArkUI framework.
    // Subclasses can override to trigger component refresh.
  }

  /**
   * Get the list of view IDs from root to this node.
   * Aligned with iOS: @property(nonatomic, readonly) NSArray<NSString *> *idList;
   */
  getIdList(): string[] {
    const ids: string[] = []
    let node: DoricViewNode | undefined = this
    while (node !== undefined) {
      if (node.viewId.length > 0) {
        ids.unshift(node.viewId)
      }
      node = node.superNode
    }
    return ids
  }

  /**
   * Call a JS response callback on this node.
   * Aligned with iOS: - (DoricAsyncResult *)callJSResponse:(NSString *)funcId, ...;
   */
  callJSResponse(funcId: string, ...args: (string | number | boolean)[]): string {
    return this.doricContext.callEntity(
      '__response__',
      JSON.stringify(this.getIdList()),
      funcId,
      ...args
    )
  }

  /**
   * Get the method handler map for command dispatch.
   * Subclasses override to expose callable methods.
   * Aligned with iOS runtime method lookup on ViewNode.
   */
  getMethodMap(): Map<string, DoricViewNodeMethodHandler> {
    return new Map()
  }

  /**
   * Dispatch a command method call.
   * Used by DoricShaderPlugin.command().
   */
  callMethod(method: string, argument: string, promise: DoricPromise): boolean {
    const methodMap = this.getMethodMap()
    const handler = methodMap.get(method)
    if (handler !== undefined) {
      try {
        handler(argument, promise)
      } catch (e) {
        hilog.error(DOMAIN, TAG, 'ViewNode method error: %{public}s.%{public}s - %{public}s',
          this.type, method, (e as Error).message)
        promise.reject(JSON.stringify((e as Error).message))
      }
      return true
    }
    return false
  }

  /**
   * Reset the node state.
   * Aligned with iOS: - (void)reset;
   */
  reset(): void {
    this.props_ = {}
  }
}

/**
 * DoricSuperNode - Base class for container nodes that have children.
 *
 * Aligned with iOS DoricSuperNode:
 *   - subNodeWithViewId:
 *   - blendSubNode:
 *   - subModelOf:
 *   - clearSubModel
 *
 * Aligned with Android SuperNode:
 *   - getSubNodeById(viewId)
 */
export class DoricSuperNode extends DoricViewNode {
  /** Whether child nodes can be reused */
  reusable: boolean = false

  /** Map of child viewId -> sub model */
  protected subModels_: Map<string, Record<string, Object>> = new Map()

  /**
   * Find a child node by view ID.
   * Aligned with iOS: - (DoricViewNode *)subNodeWithViewId:(NSString *)viewId;
   * Aligned with Android: ViewNode<?> getSubNodeById(String viewId);
   */
  subNodeWithViewId(_viewId: string): DoricViewNode | undefined {
    // Override in concrete container nodes (StackNode, VLayoutNode, etc.)
    return undefined
  }

  /**
   * Get the sub model for a given viewId.
   * Aligned with iOS: - (NSDictionary *)subModelOf:(NSString *)viewId;
   */
  subModelOf(viewId: string): Record<string, Object> | undefined {
    return this.subModels_.get(viewId)
  }

  /**
   * Set the sub model for a given viewId.
   * Aligned with iOS: - (void)setSubModel:(NSDictionary *)model in:(NSString *)viewId;
   */
  setSubModel(model: Record<string, Object>, viewId: string): void {
    this.subModels_.set(viewId, model)
  }

  /**
   * Clear all sub models.
   * Aligned with iOS: - (void)clearSubModel;
   */
  clearSubModel(): void {
    this.subModels_.clear()
  }

  /**
   * Remove a specific sub model.
   * Aligned with iOS: - (void)removeSubModel:(NSString *)viewId;
   */
  removeSubModel(viewId: string): void {
    this.subModels_.delete(viewId)
  }
}

/**
 * DoricRootNode - The root of the Doric view tree.
 *
 * Aligned with iOS DoricRootNode / Android RootNode.
 * Represents the top-level container that hosts all rendered content.
 */
export class DoricRootNode extends DoricSuperNode {
  constructor(context: DoricContextRef) {
    super(context)
    this.type = 'Root'
  }

  /**
   * Override requestLayout: for the root node, trigger a full relayout
   * of the view tree.
   */
  requestLayout(): void {
    // In OHOS ArkUI, layout is driven by the framework.
    // The root node signals the DoricPanel to re-render.
    hilog.debug(DOMAIN, TAG, 'RootNode requestLayout for context: %{public}s',
      this.doricContext.contextId)
  }
}
