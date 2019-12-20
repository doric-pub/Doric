import { DoricGroupViewNode, LayoutSpec, FrameSize, LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM } from "./DoricViewNode";

export class DoricVLayoutNode extends DoricGroupViewNode {
    space = 0
    gravity = 0
    contentSize = {
        width: 0,
        height: 0,
        weight: 0,
    }
    build() {
        const ret = document.createElement('div')
        ret.style.display = "flex"
        ret.style.flexDirection = "column"
        ret.style.flexWrap = "nowrap"
        return ret
    }
    blendProps(v: HTMLElement, propName: string, prop: any) {
        if (propName === 'space') {
            this.space = prop
        } else if (propName === 'gravity') {
            this.gravity = prop
            if ((this.gravity & LEFT) === LEFT) {
                this.view.style.justifyContent = "flex-start"
            } else if ((this.gravity & RIGHT) === RIGHT) {
                this.view.style.justifyContent = "flex-end"
            } else if ((this.gravity & CENTER_X) === CENTER_X) {
                this.view.style.justifyContent = "center"
            }
            if ((this.gravity & TOP) === TOP) {
                this.view.style.alignItems = "flex-start"
            } else if ((this.gravity & BOTTOM) === BOTTOM) {
                this.view.style.alignItems = "flex-end"
            } else if ((this.gravity & CENTER_Y) === CENTER_Y) {
                this.view.style.alignItems = "center"
            }
        } else {
            super.blendProps(v, propName, prop)
        }
    }

    measureContentSize(targetSize: { width: number, height: number }) {
        let width = this.frameWidth
        let height = this.frameHeight
        let contentSize = { width: 0, height: 0, weight: 0 }
        let limitSize = {
            width: targetSize.width - this.paddingLeft - this.paddingRight,
            height: targetSize.height - this.paddingTop - this.paddingBottom,
        }
        contentSize = this.childNodes.reduce((prev, current) => {
            const size = current.measureContentSize(limitSize)
            return {
                width: Math.max(prev.width, size.width),
                height: prev.height + size.height + this.space
                    + current.layoutConfig?.margin?.top || 0
                    + current.layoutConfig?.margin?.bottom || 0,
                weight: prev.weight + current.layoutConfig?.weight || 0
            }
        }, contentSize)
        contentSize.height -= this.space
        switch (this.layoutConfig.widthSpec) {
            case LayoutSpec.AT_MOST:
                width = targetSize.width
                break
            case LayoutSpec.WRAP_CONTENT:
                width = contentSize.width
                break
            default:
                break
        }
        switch (this.layoutConfig.heightSpec) {
            case LayoutSpec.AT_MOST:
                height = targetSize.height
                break
            case LayoutSpec.WRAP_CONTENT:
                height = contentSize.height
                break
            default:
                break
        }
        if (contentSize.weight > 0) {
            contentSize.height = targetSize.height
        }
        this.contentSize = contentSize
        return { width, height }
    }

    layoutSelf(targetSize: FrameSize) {
        const { width, height } = this.measureContentSize(targetSize)
        this.width = width
        this.height = height
    }
}