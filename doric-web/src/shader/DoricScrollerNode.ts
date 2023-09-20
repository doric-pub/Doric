import { DoricSuperNode, DVModel, DoricViewNode } from "./DoricViewNode";
import { LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString } from "./DoricLayouts";

export class DoricScrollerNode extends DoricSuperNode {


    childViewId: string = ""
    childNode?: DoricViewNode
    build() {
        const ret = document.createElement('div')
        ret.style.overflow = "scroll"
        return ret
    }
    blendProps(v: HTMLElement, propName: string, prop: any) {
        if (propName === 'content') {
            this.childViewId = prop
        } else {
            super.blendProps(v, propName, prop)
        }
    }
    blendSubNode(model: DVModel): void {
        this.childNode?.blend(model.props)
    }
    getSubNodeById(viewId: string) {
        return viewId === this.childViewId ? this.childNode : undefined
    }

    onBlending() {
        super.onBlending()
        const model = this.getSubModel(this.childViewId)
        if (model === undefined) {
            return
        }
        if (this.childNode) {
            if (this.childNode.viewId === this.childViewId) {
                ///skip
            } else {
                if (this.reusable && this.childNode.viewType === model.type) {
                    this.childNode.viewId = model.id
                    this.childNode.blend(model.props)
                } else {
                    this.view.removeChild(this.childNode.view)
                    const childNode = DoricViewNode.create(this.context, model.type)
                    if (childNode === undefined) {
                        return
                    }
                    childNode.viewId = model.id
                    childNode.init(this)
                    childNode.blend(model.props)
                    this.view.appendChild(childNode.view)
                    this.childNode = childNode
                }
            }
        } else {
            const childNode = DoricViewNode.create(this.context, model.type)
            if (childNode === undefined) {
                return
            }
            childNode.viewId = model.id
            childNode.init(this)
            childNode.blend(model.props)
            this.view.appendChild(childNode.view)
            this.childNode = childNode
        }
    }

    onBlended() {
        super.onBlended()
        this.childNode?.onBlended()
    }
}