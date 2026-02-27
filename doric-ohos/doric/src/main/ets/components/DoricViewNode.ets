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
 *
 * OHOS adaptation:
 *   Each node holds a DoricNodeModel (@Observed) which is the data bridge
 *   to ArkUI's declarative rendering. When blend() updates the model,
 *   ArkUI automatically re-renders the corresponding component.
 */
import { DoricPromise } from './DoricPromise'
import { DoricNodeModel, doricColorToHex } from './DoricNodeModel'
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
  /** Notify the context that the view tree model has changed */
  onRenderFinished(): void
}

/**
 * Type for ViewNode method handlers (used by command dispatch).
 */
export type DoricViewNodeMethodHandler = (argument: string, promise: DoricPromise) => void

/**
 * Node factory function type.
 * Creates a DoricViewNode subclass instance given a DoricContextRef.
 */
export type DoricViewNodeFactoryFunc = (context: DoricContextRef) => DoricViewNode

/**
 * DoricViewNode - Base view node.
 *
 * Aligned with iOS DoricViewNode / Android ViewNode.
 *
 * Each node owns a DoricNodeModel. When blend() is called with props from JS,
 * the node updates its model, which triggers ArkUI re-render.
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

  /**
   * The observable model for ArkUI rendering.
   * This is the bridge between Doric's imperative view node and ArkUI's declarative UI.
   */
  nodeModel: DoricNodeModel = new DoricNodeModel()

  /** Callback IDs from JS (e.g., onClick) */
  protected callbackIds_: Record<string, string> = {}

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
   *
   * Updates both the internal props and the DoricNodeModel for ArkUI rendering.
   */
  blend(props: Record<string, Object>): void {
    if (props === undefined || props === null) {
      return
    }
    const keys = Object.keys(props)
    for (const key of keys) {
      if (props[key] === undefined || props[key] === null) {
        continue
      }
      this.blendProp(key, props[key])
    }
    this.afterBlended(props)
  }

  /**
   * Blend a single property. Updates both internal props and the model.
   * Aligned with iOS: - (void)blendView:(V)view forPropName:(NSString *)name propValue:(id)prop;
   *
   * Handles base properties common to all nodes:
   *   width, height, x, y, backgroundColor, alpha, hidden, border, corners,
   *   shadow, padding, layoutConfig, onClick, translationX/Y, scaleX/Y, rotation, pivotX/Y
   */
  blendProp(name: string, value: Object): void {
    this.props_[name] = value

    // Update the DoricNodeModel based on the property name
    // Aligned with iOS DoricViewNode.blendView:forPropName:propValue:
    if (name === 'width') {
      this.nodeModel.width = value as number
    } else if (name === 'height') {
      this.nodeModel.height = value as number
    } else if (name === 'x') {
      this.nodeModel.x = value as number
    } else if (name === 'y') {
      this.nodeModel.y = value as number
    } else if (name === 'backgroundColor') {
      if (typeof value === 'number') {
        this.nodeModel.backgroundColor = doricColorToHex(value as number)
      }
    } else if (name === 'alpha') {
      this.nodeModel.alpha = value as number
    } else if (name === 'hidden') {
      this.nodeModel.hidden = value as boolean
    } else if (name === 'onClick') {
      this.callbackIds_['onClick'] = value as string
      this.nodeModel.onClickId = value as string
    } else if (name === 'border') {
      const border = value as Record<string, Object>
      if (border['width'] !== undefined) {
        this.nodeModel.border.width = border['width'] as number
      }
      if (border['color'] !== undefined) {
        this.nodeModel.border.color = doricColorToHex(border['color'] as number)
      }
    } else if (name === 'corners') {
      if (typeof value === 'number') {
        this.nodeModel.corners.radius = value as number
        this.nodeModel.corners.individual = false
      } else {
        const corners = value as Record<string, number>
        this.nodeModel.corners.leftTop = corners['leftTop'] ?? 0
        this.nodeModel.corners.rightTop = corners['rightTop'] ?? 0
        this.nodeModel.corners.rightBottom = corners['rightBottom'] ?? 0
        this.nodeModel.corners.leftBottom = corners['leftBottom'] ?? 0
        this.nodeModel.corners.individual = true
      }
    } else if (name === 'shadow') {
      const shadow = value as Record<string, Object>
      this.nodeModel.shadow.opacity = (shadow['opacity'] as number) ?? 0
      this.nodeModel.shadow.color = doricColorToHex((shadow['color'] as number) ?? 0)
      this.nodeModel.shadow.radius = (shadow['radius'] as number) ?? 0
      this.nodeModel.shadow.offsetX = (shadow['offsetX'] as number) ?? 0
      this.nodeModel.shadow.offsetY = (shadow['offsetY'] as number) ?? 0
    } else if (name === 'padding') {
      const padding = value as Record<string, number>
      this.nodeModel.padding.left = padding['left'] ?? 0
      this.nodeModel.padding.top = padding['top'] ?? 0
      this.nodeModel.padding.right = padding['right'] ?? 0
      this.nodeModel.padding.bottom = padding['bottom'] ?? 0
    } else if (name === 'layoutConfig') {
      this.blendLayoutConfig(value as Record<string, Object>)
    } else if (name === 'translationX') {
      this.nodeModel.translationX = value as number
    } else if (name === 'translationY') {
      this.nodeModel.translationY = value as number
    } else if (name === 'scaleX') {
      this.nodeModel.scaleX = value as number
    } else if (name === 'scaleY') {
      this.nodeModel.scaleY = value as number
    } else if (name === 'rotation') {
      this.nodeModel.rotation = value as number
    } else if (name === 'pivotX') {
      this.nodeModel.pivotX = value as number
    } else if (name === 'pivotY') {
      this.nodeModel.pivotY = value as number
    } else {
      // Unknown property - subclass may handle it
      hilog.debug(DOMAIN, TAG, 'blendProp: unhandled prop %{public}s for type %{public}s',
        name, this.type)
    }
  }

  /**
   * Blend layout config properties.
   * Aligned with iOS: - (void)blendLayoutConfig:(NSDictionary *)params;
   */
  private blendLayoutConfig(params: Record<string, Object>): void {
    const lc = this.nodeModel.layoutConfig
    if (params['widthSpec'] !== undefined) {
      lc.widthSpec = params['widthSpec'] as number
    }
    if (params['heightSpec'] !== undefined) {
      lc.heightSpec = params['heightSpec'] as number
    }
    if (params['alignment'] !== undefined) {
      lc.alignment = params['alignment'] as number
    }
    if (params['weight'] !== undefined) {
      lc.weight = params['weight'] as number
    }
    if (params['maxWidth'] !== undefined) {
      lc.maxWidth = params['maxWidth'] as number
    }
    if (params['maxHeight'] !== undefined) {
      lc.maxHeight = params['maxHeight'] as number
    }
    if (params['minWidth'] !== undefined) {
      lc.minWidth = params['minWidth'] as number
    }
    if (params['minHeight'] !== undefined) {
      lc.minHeight = params['minHeight'] as number
    }
    // Margin
    const margin = params['margin'] as Record<string, number> | undefined
    if (margin !== undefined) {
      if (margin['left'] !== undefined) {
        lc.marginLeft = margin['left']
      }
      if (margin['top'] !== undefined) {
        lc.marginTop = margin['top']
      }
      if (margin['right'] !== undefined) {
        lc.marginRight = margin['right']
      }
      if (margin['bottom'] !== undefined) {
        lc.marginBottom = margin['bottom']
      }
    }
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
   *
   * In OHOS, this triggers the model invalidation so ArkUI re-renders.
   */
  requestLayout(): void {
    this.nodeModel.invalidate()
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
    this.nodeModel = new DoricNodeModel()
    this.nodeModel.viewId = this.viewId
    this.nodeModel.type = this.type
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
   * Override blendProp to handle 'subviews' property.
   * Aligned with iOS DoricSuperNode.blendView:forPropName:propValue:
   *
   * The 'subviews' property contains an array of sub-node models.
   * Each model is { id, type, props } that gets stored in subModels_.
   */
  blendProp(name: string, value: Object): void {
    if (name === 'subviews') {
      const subviews = value as Record<string, Object>[]
      for (const subModel of subviews) {
        this.mixinSubNode(subModel)
        this.blendSubNode(subModel)
      }
    } else {
      super.blendProp(name, value)
    }
  }

  /**
   * Mixin a sub node model into the stored sub-models.
   * Aligned with iOS DoricSuperNode.mixinSubNode:
   *
   * If we already have a model for this viewId, merge the new props into it.
   * Otherwise, store the new model directly.
   */
  private mixinSubNode(model: Record<string, Object>): void {
    const viewId = model['id'] as string
    const oldModel = this.subModels_.get(viewId)
    if (oldModel !== undefined) {
      // Merge props
      const srcProps = model['props'] as Record<string, Object>
      const targetProps = oldModel['props'] as Record<string, Object>
      if (srcProps !== undefined && targetProps !== undefined) {
        // ArkTS does not support object spread, so copy manually
        const merged: Record<string, Object> = {} as Record<string, Object>
        const targetKeys = Object.keys(targetProps)
        for (const tk of targetKeys) {
          merged[tk] = targetProps[tk]
        }
        const srcKeys = Object.keys(srcProps)
        for (const sk of srcKeys) {
          if (sk !== 'subviews') {
            merged[sk] = srcProps[sk]
          }
        }
        oldModel['props'] = merged
      }
    } else {
      this.subModels_.set(viewId, model)
    }
  }

  /**
   * Find a child node by view ID.
   * Aligned with iOS: - (DoricViewNode *)subNodeWithViewId:(NSString *)viewId;
   * Aligned with Android: ViewNode<?> getSubNodeById(String viewId);
   */
  subNodeWithViewId(_viewId: string): DoricViewNode | undefined {
    // Override in concrete container nodes (GroupNode, etc.)
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

  /**
   * Blend a sub node model.
   * Called by child nodes when their parent handles layout changes.
   */
  blendSubNode(subModel: Record<string, Object>): void {
    const viewId = subModel['id'] as string
    this.setSubModel(subModel, viewId)
  }
}

/**
 * DoricGroupNode - Base class for group/container nodes that manage child arrays.
 *
 * Aligned with iOS DoricGroupNode:
 *   - childNodes: array of child view nodes
 *   - childViewIds: array of child view IDs from JS
 *   - configChildNodes: reconcile JS child model with native nodes
 *
 * This is the key class that handles child node reconciliation,
 * creating/reusing/removing child nodes as the JS model changes.
 */
export class DoricGroupNode extends DoricSuperNode {
  /** Current child nodes */
  childNodes: DoricViewNode[] = []
  /** Child view IDs from the JS model */
  childViewIds: string[] = []

  /**
   * Override blendProp to capture the 'children' property.
   * Aligned with iOS DoricGroupNode.blendView:forPropName:propValue:
   */
  blendProp(name: string, value: Object): void {
    if (name === 'children') {
      this.childViewIds = value as string[]
    } else {
      super.blendProp(name, value)
    }
  }

  /**
   * After blending, reconcile child nodes.
   * Aligned with iOS DoricGroupNode.afterBlended:
   */
  afterBlended(_props: Record<string, Object>): void {
    this.configChildNodes()
  }

  /**
   * Reconcile the child node array with the JS model.
   * Aligned with iOS DoricGroupNode.configChildNodes.
   *
   * This method:
   *   1. For each childViewId, finds or creates the corresponding node
   *   2. Blends the child's props from its sub-model
   *   3. Updates the nodeModel.children array for ArkUI rendering
   *   4. Removes excess old nodes
   */
  configChildNodes(): void {
    const childNodes: DoricViewNode[] = [...this.childNodes]

    for (let idx = 0; idx < this.childViewIds.length; idx++) {
      const viewId = this.childViewIds[idx]
      const model = this.subModelOf(viewId)
      const type = model !== undefined ? model['type'] as string : ''

      if (idx < childNodes.length) {
        const oldNode = childNodes[idx]
        if (viewId === oldNode.viewId) {
          // Same node, blend updated props
          if (model !== undefined) {
            oldNode.blend(model['props'] as Record<string, Object>)
          }
        } else {
          if (this.reusable) {
            if (oldNode.type === type) {
              // Same type, reuse
              oldNode.viewId = viewId
              oldNode.nodeModel.viewId = viewId
              if (model !== undefined) {
                oldNode.blend(model['props'] as Record<string, Object>)
              }
            } else {
              // Different type, replace
              const viewNode = DoricViewNodeFactory.create(this.doricContext, type)
              if (viewNode instanceof DoricGroupNode) {
                (viewNode as DoricGroupNode).reusable = this.reusable
              }
              viewNode.viewId = viewId
              viewNode.nodeModel.viewId = viewId
              viewNode.nodeModel.type = type
              viewNode.initWithSuperNode(this)
              if (model !== undefined) {
                viewNode.blend(model['props'] as Record<string, Object>)
              }
              childNodes[idx] = viewNode
            }
          } else {
            // Find in remaining nodes
            let position = -1
            for (let start = idx + 1; start < childNodes.length; start++) {
              if (viewId === childNodes[start].viewId) {
                position = start
                break
              }
            }

            if (position >= 0) {
              // Found, swap
              const reused = childNodes[position]
              childNodes[position] = childNodes[idx]
              childNodes[idx] = reused
            } else {
              // Not found, insert
              const viewNode = DoricViewNodeFactory.create(this.doricContext, type)
              viewNode.viewId = viewId
              viewNode.nodeModel.viewId = viewId
              viewNode.nodeModel.type = type
              viewNode.initWithSuperNode(this)
              if (model !== undefined) {
                viewNode.blend(model['props'] as Record<string, Object>)
              }
              childNodes.splice(idx, 0, viewNode)
            }
          }
        }
      } else {
        // New node to insert
        const viewNode = DoricViewNodeFactory.create(this.doricContext, type)
        if (viewNode instanceof DoricGroupNode) {
          (viewNode as DoricGroupNode).reusable = this.reusable
        }
        viewNode.viewId = viewId
        viewNode.nodeModel.viewId = viewId
        viewNode.nodeModel.type = type
        viewNode.initWithSuperNode(this)
        if (model !== undefined) {
          viewNode.blend(model['props'] as Record<string, Object>)
        }
        childNodes.push(viewNode)
      }
    }

    // Remove excess old nodes
    while (childNodes.length > this.childViewIds.length) {
      childNodes.pop()
    }

    this.childNodes = childNodes

    // Sync childNodes' models to nodeModel.children for ArkUI rendering
    this.syncChildModels()
  }

  /**
   * Sync the child node models to this node's DoricNodeModel.children array.
   * This makes the model tree reactive for ArkUI rendering.
   */
  private syncChildModels(): void {
    const models: DoricNodeModel[] = []
    for (const child of this.childNodes) {
      models.push(child.nodeModel)
    }
    this.nodeModel.children = models
  }

  /**
   * Find child node by viewId.
   * Aligned with iOS DoricGroupNode.subNodeWithViewId:
   */
  subNodeWithViewId(viewId: string): DoricViewNode | undefined {
    for (const node of this.childNodes) {
      if (viewId === node.viewId) {
        return node
      }
    }
    return undefined
  }

  /**
   * Blend a sub node by its model.
   * Aligned with iOS DoricGroupNode.blendSubNode:
   */
  blendSubNode(subModel: Record<string, Object>): void {
    super.blendSubNode(subModel)
    const viewId = subModel['id'] as string
    for (const child of this.childNodes) {
      if (viewId === child.viewId) {
        child.blend(subModel['props'] as Record<string, Object>)
        break
      }
    }
  }

  /**
   * Request layout for this and all children.
   * Aligned with iOS DoricGroupNode.requestLayout.
   */
  requestLayout(): void {
    super.requestLayout()
    for (const child of this.childNodes) {
      child.requestLayout()
    }
  }

  /**
   * Clear sub model and child nodes.
   * Aligned with iOS DoricGroupNode.clearSubModel.
   */
  clearSubModel(): void {
    super.clearSubModel()
    this.childNodes = []
    this.childViewIds = []
    this.nodeModel.children = []
  }
}

/**
 * DoricRootNode - The root of the Doric view tree.
 *
 * Aligned with iOS DoricRootNode / Android RootNode.
 * Represents the top-level container that hosts all rendered content.
 * It behaves like a DoricGroupNode (Stack layout).
 */
export class DoricRootNode extends DoricGroupNode {
  constructor(context: DoricContextRef) {
    super(context)
    this.type = 'Root'
    this.nodeModel.type = 'Root'
  }

  /**
   * Override requestLayout: for the root node, trigger a full relayout
   * of the view tree and notify the context.
   */
  requestLayout(): void {
    super.requestLayout()
    // Notify the context that rendering is complete
    this.doricContext.onRenderFinished()
    hilog.debug(DOMAIN, TAG, 'RootNode requestLayout for context: %{public}s',
      this.doricContext.contextId)
  }
}

/**
 * DoricViewNodeFactory - Factory for creating DoricViewNode instances by type.
 *
 * Aligned with iOS: + (DoricViewNode *)create:(DoricContext *)context withType:(NSString *)type;
 * Aligned with Android: DoricRegistry.acquireViewNode(type)
 *
 * The factory uses a registry to map type names to factory functions.
 * Built-in types (Stack, VLayout, HLayout, Text, Image) are pre-registered.
 */
export class DoricViewNodeFactory {
  private static nodeFactories_: Map<string, DoricViewNodeFactoryFunc> = new Map()
  private static registered_: boolean = false

  /**
   * Register built-in node types.
   */
  private static registerBuiltins(): void {
    if (DoricViewNodeFactory.registered_) {
      return
    }
    DoricViewNodeFactory.registered_ = true

    // Container types
    DoricViewNodeFactory.register('Stack', (ctx) => {
      const node = new DoricGroupNode(ctx)
      node.type = 'Stack'
      node.nodeModel.type = 'Stack'
      return node
    })
    DoricViewNodeFactory.register('VLayout', (ctx) => {
      const node = new DoricGroupNode(ctx)
      node.type = 'VLayout'
      node.nodeModel.type = 'VLayout'
      return node
    })
    DoricViewNodeFactory.register('HLayout', (ctx) => {
      const node = new DoricGroupNode(ctx)
      node.type = 'HLayout'
      node.nodeModel.type = 'HLayout'
      return node
    })

    // Leaf types
    DoricViewNodeFactory.register('Text', (ctx) => {
      const node = new DoricTextNode(ctx)
      node.type = 'Text'
      node.nodeModel.type = 'Text'
      return node
    })
    DoricViewNodeFactory.register('Image', (ctx) => {
      const node = new DoricImageNode(ctx)
      node.type = 'Image'
      node.nodeModel.type = 'Image'
      return node
    })
  }

  /**
   * Register a node factory for a given type.
   */
  static register(type: string, factory: DoricViewNodeFactoryFunc): void {
    DoricViewNodeFactory.nodeFactories_.set(type, factory)
  }

  /**
   * Create a DoricViewNode by type.
   * Falls back to a generic DoricGroupNode if the type is not found.
   */
  static create(context: DoricContextRef, type: string): DoricViewNode {
    DoricViewNodeFactory.registerBuiltins()

    const factory = DoricViewNodeFactory.nodeFactories_.get(type)
    if (factory !== undefined) {
      return factory(context)
    }

    // Fallback: create a generic group node
    hilog.warn(DOMAIN, TAG, 'Unknown node type: %{public}s, using fallback', type)
    const node = new DoricGroupNode(context)
    node.type = type
    node.nodeModel.type = type
    return node
  }
}


/**
 * DoricTextNode - Node for rendering text.
 * Aligned with iOS DoricTextNode.
 */
export class DoricTextNode extends DoricViewNode {
  constructor(context: DoricContextRef) {
    super(context)
    this.type = 'Text'
  }

  /**
   * Override blendProp to handle Text-specific properties.
   * Aligned with iOS DoricTextNode.blendView:forPropName:propValue:
   *
   * Text-specific properties are stored in nodeModel.textConfig (DoricTextConfigModel).
   */
  blendProp(name: string, value: Object): void {
    const textConfig = this.nodeModel.ensureTextConfig()
    if (name === 'text') {
      textConfig.text = value as string
    } else if (name === 'fontSize') {
      textConfig.fontSize = value as number
    } else if (name === 'textColor') {
      textConfig.fontColor = doricColorToHex(value as number)
    } else if (name === 'textAlignment') {
      textConfig.textAlignment = value as number
    } else if (name === 'maxLines') {
      textConfig.maxLines = value as number
    } else if (name === 'fontStyle') {
      textConfig.fontStyle = value as string
    } else if (name === 'underline') {
      textConfig.underline = value as boolean
    } else if (name === 'strikethrough') {
      textConfig.strikethrough = value as boolean
    } else {
      super.blendProp(name, value)
    }
  }
}

/**
 * DoricImageNode - Node for rendering images.
 * Aligned with iOS DoricImageNode.
 */
export class DoricImageNode extends DoricViewNode {
  constructor(context: DoricContextRef) {
    super(context)
    this.type = 'Image'
  }

  /**
   * Override blendProp to handle Image-specific properties.
   * Aligned with iOS DoricImageNode.blendView:forPropName:propValue:
   *
   * Image-specific properties are stored in nodeModel.imageConfig (DoricImageConfigModel).
   */
  blendProp(name: string, value: Object): void {
    const imageConfig = this.nodeModel.ensureImageConfig()
    if (name === 'imageUrl' || name === 'url') {
      imageConfig.imageUrl = value as string
    } else if (name === 'imageRes' || name === 'resId') {
      imageConfig.imageRes = value as string
    } else if (name === 'imagePath') {
      imageConfig.imagePath = value as string
    } else if (name === 'imageBase64') {
      imageConfig.imageBase64 = value as string
    } else if (name === 'scaleType') {
      imageConfig.scaleType = value as number
    } else if (name === 'isBlur') {
      imageConfig.isBlur = value as boolean
    } else if (name === 'placeHolderColor') {
      imageConfig.placeHolderColor = doricColorToHex(value as number)
    } else {
      super.blendProp(name, value)
    }
  }
}
