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
        return document.createElement('div')
    }
    blendProps(v: HTMLElement, propName: string, prop: any) {
        if (propName === 'space') {
            this.space = prop
        } else if (propName === 'gravity') {
            this.gravity = prop
        } else {
            super.blendProps(v, propName, prop)
        }
    }
    blend(props: { [index: string]: any }) {
        super.blend(props)
        this.childNodes.forEach(e => {
            e.view.style.position = "absolute"
        })
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
        let yStart = this.paddingTop;
        if ((this.gravity & TOP) == TOP) {
            yStart = this.paddingTop
        } else if ((this.gravity & BOTTOM) == BOTTOM) {
            yStart = targetSize.height - this.contentSize.height - this.paddingBottom;
        } else if ((this.gravity & CENTER_Y) == CENTER_Y) {
            yStart = (targetSize.height - this.contentSize.height - this.paddingTop - this.paddingBottom) / 2 + this.paddingTop
        }
        let remain = targetSize.height - this.contentSize.height - this.paddingTop - this.paddingBottom
        this.childNodes.forEach(e => {
            const childTargetSize = {
                width: width - this.paddingLeft - this.paddingRight,
                height: height - yStart - this.paddingBottom,
            }
            if (e.layoutConfig?.weight > 0) {
                childTargetSize.height += remain / this.contentSize.weight * e.layoutConfig.weight
            }
            e.layoutSelf(childTargetSize)
            let gravity = e.layoutConfig?.alignment | this.gravity
            if ((gravity & LEFT) === LEFT) {
                e.x = 0
            } else if ((gravity & RIGHT) === RIGHT) {
                e.x = width - e.width + this.paddingLeft - this.paddingRight
            } else if ((gravity & CENTER_X) === CENTER_X) {
                e.x = width / 2 - e.width / 2 - this.paddingLeft
            } else {
                if (e.layoutConfig.margin?.left) {
                    e.x = e.layoutConfig.margin?.left
                } else if (e.layoutConfig.margin?.right) {
                    e.x = width - e.width + this.paddingLeft - this.paddingRight - e.layoutConfig.margin?.right
                }
            }
            if (e.layoutConfig.margin?.top !== undefined) {
                yStart += e.layoutConfig.margin.top
            }
            e.y = yStart - this.paddingTop
            yStart += e.height + this.space
            if (e.layoutConfig.margin?.bottom !== undefined) {
                yStart += e.layoutConfig.margin.bottom
            }
        })
    }
}