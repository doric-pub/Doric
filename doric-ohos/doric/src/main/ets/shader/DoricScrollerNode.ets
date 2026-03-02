import { DoricViewNode, DoricSuperNode, DoricContextRef, DoricViewNodeFactory } from './DoricViewNode'
import { DoricPromise } from '../plugin/DoricPromise'
import { DoricScrollChangeModel } from './DoricNodeModel'

export class DoricScrollerNode extends DoricSuperNode {
  childNode: DoricViewNode | undefined = undefined
  childViewId: string = ''

  constructor(context: DoricContextRef) {
    super(context)
    this.type = 'Scroller'
  }

  blendProp(name: string, value: Object): void {
    const scrollConfig = this.nodeModel.ensureScrollConfig()
    if (name === 'content') {
      this.childViewId = value as string
      scrollConfig.contentViewId = this.childViewId
    } else if (name === 'scrollable') {
      scrollConfig.scrollable = value as boolean
    } else if (name === 'bounces') {
      scrollConfig.bounces = value as boolean
    } else if (name === 'scrollsToTop') {
      scrollConfig.scrollsToTop = value as boolean
    } else if (name === 'onScroll') {
      scrollConfig.onScrollFuncId = value as string
    } else if (name === 'onScrollEnd') {
      scrollConfig.onScrollEndFuncId = value as string
    } else {
      super.blendProp(name, value)
    }
  }

  afterBlended(props: Record<string, Object>): void {
    const childModel = this.subModelOf(this.childViewId)
    if (childModel === undefined) {
      return
    }

    const viewId = childModel['id'] as string
    const type = childModel['type'] as string
    const childProps = childModel['props'] as Record<string, Object>

    if (this.childNode) {
      if (this.childNode.viewId === viewId) {
        // skip
      } else {
        if (this.reusable && type === this.childNode.type) {
          this.childNode.viewId = viewId
          this.childNode.nodeModel.viewId = viewId
          this.childNode.blend(childProps)
        } else {
          this.childNode = DoricViewNodeFactory.create(this.doricContext, type)
          this.childNode.viewId = viewId
          this.childNode.nodeModel.viewId = viewId
          this.childNode.initWithSuperNode(this)
          this.childNode.blend(childProps)
        }
      }
    } else {
      this.childNode = DoricViewNodeFactory.create(this.doricContext, type)
      this.childNode.viewId = viewId
      this.childNode.nodeModel.viewId = viewId
      this.childNode.initWithSuperNode(this)
      this.childNode.blend(childProps)
    }

    this.nodeModel.children = [this.childNode.nodeModel]
  }

  blendSubNode(subModel: Record<string, Object>): void {
    if (this.childNode && this.childNode.viewId === subModel['id']) {
      this.childNode.blend(subModel['props'] as Record<string, Object>)
    }
  }

  subNodeWithViewId(viewId: string): DoricViewNode | undefined {
    if (viewId === this.childViewId) {
      return this.childNode
    }
    return undefined
  }

  requestLayout(): void {
    super.requestLayout()
    if (this.childNode) {
      this.childNode.requestLayout()
    }
  }

  getMethodMap(): Map<string, (argument: string, promise: DoricPromise) => void> {
    const map = super.getMethodMap()
    map.set('scrollTo', (argument, promise) => {
      const params = JSON.parse(argument) as Record<string, Object>
      this.scrollTo(params)
      promise.resolve()
    })
    map.set('scrollBy', (argument, promise) => {
      const params = JSON.parse(argument) as Record<string, Object>
      this.scrollBy(params)
      promise.resolve()
    })
    return map
  }

  scrollTo(params: Record<string, Object>): void {
    const animated = params['animated'] as boolean
    const offsetDic = params['offset'] as Record<string, number>
    const scrollConfig = this.nodeModel.ensureScrollConfig()
    
    const change = new DoricScrollChangeModel()
    change.offsetX = offsetDic['x']
    change.offsetY = offsetDic['y']
    change.animated = animated
    change.anchor = Date.now() 
    scrollConfig.scrollCommand = change
  }

  scrollBy(params: Record<string, Object>): void {
    const animated = params['animated'] as boolean
    const offsetDic = params['offset'] as Record<string, number>
    const scrollConfig = this.nodeModel.ensureScrollConfig()
    
    const currentX = scrollConfig.contentOffset.x
    const currentY = scrollConfig.contentOffset.y
    
    const change = new DoricScrollChangeModel()
    change.offsetX = currentX + offsetDic['x']
    change.offsetY = currentY + offsetDic['y']
    change.animated = animated
    change.anchor = Date.now() 
    scrollConfig.scrollCommand = change
  }
}
