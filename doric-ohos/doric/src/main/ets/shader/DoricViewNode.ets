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

import { DoricPromise } from '../plugin/DoricPromise'
import { DoricNodeModel, doricColorToHex } from './DoricNodeModel'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricViewNode'
const DOMAIN = 0x8000

/**
 * Interface for DoricContext reference.
 */
export interface DoricContextRef {
  contextId: string
  destroyed: boolean
  callEntity(method: string, ...args: (string | number | boolean)[]): string
  onRenderFinished(): void
}

/**
 * Type for ViewNode method handlers.
 */
export type DoricViewNodeMethodHandler = (argument: string, promise: DoricPromise) => void

/**
 * Node factory function type.
 */
export type DoricViewNodeFactoryFunc = (context: DoricContextRef) => DoricViewNode

/**
 * DoricViewNode - Base view node.
 */
export class DoricViewNode {
  viewId: string = ''
  type: string = ''
  doricContext: DoricContextRef
  superNode: DoricSuperNode | undefined = undefined
  index: number = 0
  protected props_: Record<string, Object> = {}

  nodeModel: DoricNodeModel = new DoricNodeModel()

  protected callbackIds_: Record<string, string> = {}

  constructor(context: DoricContextRef) {
    this.doricContext = context
  }

  initWithSuperNode(superNode: DoricSuperNode): void {
    this.superNode = superNode
  }

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

  blendProp(name: string, value: Object): void {
    this.props_[name] = value

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
      hilog.debug(DOMAIN, TAG, 'blendProp: unhandled prop %{public}s for type %{public}s',
        name, this.type)
    }
  }

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

  afterBlended(_props: Record<string, Object>): void {
  }

  requestLayout(): void {
    this.nodeModel.invalidate()
  }

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

  callJSResponse(funcId: string, ...args: (string | number | boolean)[]): string {
    return this.doricContext.callEntity(
      '__response__',
      JSON.stringify(this.getIdList()),
      funcId,
      ...args
    )
  }

  getMethodMap(): Map<string, DoricViewNodeMethodHandler> {
    return new Map()
  }

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

  reset(): void {
    this.props_ = {}
    this.nodeModel = new DoricNodeModel()
    this.nodeModel.viewId = this.viewId
    this.nodeModel.type = this.type
  }
}

export class DoricSuperNode extends DoricViewNode {
  reusable: boolean = false
  protected subModels_: Map<string, Record<string, Object>> = new Map()

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

  private mixinSubNode(model: Record<string, Object>): void {
    const viewId = model['id'] as string
    const oldModel = this.subModels_.get(viewId)
    if (oldModel !== undefined) {
      const srcProps = model['props'] as Record<string, Object>
      const targetProps = oldModel['props'] as Record<string, Object>
      if (srcProps !== undefined && targetProps !== undefined) {
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

  subNodeWithViewId(_viewId: string): DoricViewNode | undefined {
    return undefined
  }

  subModelOf(viewId: string): Record<string, Object> | undefined {
    return this.subModels_.get(viewId)
  }

  setSubModel(model: Record<string, Object>, viewId: string): void {
    this.subModels_.set(viewId, model)
  }

  clearSubModel(): void {
    this.subModels_.clear()
  }

  removeSubModel(viewId: string): void {
    this.subModels_.delete(viewId)
  }

  blendSubNode(subModel: Record<string, Object>): void {
    const viewId = subModel['id'] as string
    this.setSubModel(subModel, viewId)
  }
}

export class DoricGroupNode extends DoricSuperNode {
  childNodes: DoricViewNode[] = []
  childViewIds: string[] = []

  blendProp(name: string, value: Object): void {
    if (name === 'children') {
      this.childViewIds = value as string[]
    } else {
      super.blendProp(name, value)
    }
  }

  afterBlended(_props: Record<string, Object>): void {
    this.configChildNodes()
  }

  configChildNodes(): void {
    const childNodes: DoricViewNode[] = [...this.childNodes]

    for (let idx = 0; idx < this.childViewIds.length; idx++) {
      const viewId = this.childViewIds[idx]
      const model = this.subModelOf(viewId)
      const type = model !== undefined ? model['type'] as string : ''

      if (idx < childNodes.length) {
        const oldNode = childNodes[idx]
        if (viewId === oldNode.viewId) {
          if (model !== undefined) {
            oldNode.blend(model['props'] as Record<string, Object>)
          }
        } else {
          if (this.reusable) {
            if (oldNode.type === type) {
              oldNode.viewId = viewId
              oldNode.nodeModel.viewId = viewId
              if (model !== undefined) {
                oldNode.blend(model['props'] as Record<string, Object>)
              }
            } else {
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
            let position = -1
            for (let start = idx + 1; start < childNodes.length; start++) {
              if (viewId === childNodes[start].viewId) {
                position = start
                break
              }
            }

            if (position >= 0) {
              const reused = childNodes[position]
              childNodes[position] = childNodes[idx]
              childNodes[idx] = reused
            } else {
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

    while (childNodes.length > this.childViewIds.length) {
      childNodes.pop()
    }

    this.childNodes = childNodes
    this.syncChildModels()
  }

  private syncChildModels(): void {
    const models: DoricNodeModel[] = []
    for (const child of this.childNodes) {
      models.push(child.nodeModel)
    }
    this.nodeModel.children = models
  }

  subNodeWithViewId(viewId: string): DoricViewNode | undefined {
    for (const node of this.childNodes) {
      if (viewId === node.viewId) {
        return node
      }
    }
    return undefined
  }

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

  requestLayout(): void {
    super.requestLayout()
    for (const child of this.childNodes) {
      child.requestLayout()
    }
  }

  clearSubModel(): void {
    super.clearSubModel()
    this.childNodes = []
    this.childViewIds = []
    this.nodeModel.children = []
  }
}

export class DoricRootNode extends DoricGroupNode {
  constructor(context: DoricContextRef) {
    super(context)
    this.type = 'Root'
    this.nodeModel.type = 'Root'
  }

  requestLayout(): void {
    super.requestLayout()
    this.doricContext.onRenderFinished()
    hilog.debug(DOMAIN, TAG, 'RootNode requestLayout for context: %{public}s',
      this.doricContext.contextId)
  }
}

export class DoricViewNodeFactory {
  private static nodeFactories_: Map<string, DoricViewNodeFactoryFunc> = new Map()
  private static registered_: boolean = false

  private static registerBuiltins(): void {
    if (DoricViewNodeFactory.registered_) {
      return
    }
    DoricViewNodeFactory.registered_ = true

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

  static register(type: string, factory: DoricViewNodeFactoryFunc): void {
    DoricViewNodeFactory.nodeFactories_.set(type, factory)
  }

  static create(context: DoricContextRef, type: string): DoricViewNode {
    DoricViewNodeFactory.registerBuiltins()

    const factory = DoricViewNodeFactory.nodeFactories_.get(type)
    if (factory !== undefined) {
      return factory(context)
    }

    hilog.warn(DOMAIN, TAG, 'Unknown node type: %{public}s, using fallback', type)
    const node = new DoricGroupNode(context)
    node.type = type
    node.nodeModel.type = type
    return node
  }
}


export class DoricTextNode extends DoricViewNode {
  constructor(context: DoricContextRef) {
    super(context)
    this.type = 'Text'
  }

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

export class DoricImageNode extends DoricViewNode {
  constructor(context: DoricContextRef) {
    super(context)
    this.type = 'Image'
  }

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
