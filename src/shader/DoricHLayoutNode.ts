import { DoricGroupViewNode, LayoutSpec, FrameSize, LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM } from "./DoricViewNode";

export class DoricHLayoutNode extends DoricGroupViewNode {
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
                width: prev.width + size.width + this.space
                    + current.layoutConfig?.margin?.left || 0
                    + current.layoutConfig?.margin?.right || 0,
                height: Math.max(prev.height, size.height),
                weight: prev.weight + current.layoutConfig?.weight || 0
            }
        }, contentSize)
        contentSize.width -= this.space
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
            contentSize.width = targetSize.width
        }
        this.contentSize = contentSize
        return { width, height }
    }

    layoutSelf(targetSize: FrameSize) {
        const { width, height } = this.measureContentSize(targetSize)
        this.width = width
        this.height = height
        let xStart = this.paddingLeft;
        if ((this.gravity & LEFT) == LEFT) {
            xStart = this.paddingLeft
        } else if ((this.gravity & RIGHT) == RIGHT) {
            xStart = targetSize.width - this.contentSize.width - this.paddingRight;
        } else if ((this.gravity & CENTER_X) == CENTER_X) {
            xStart = (targetSize.width - this.contentSize.width - this.paddingLeft - this.paddingRight) / 2 + this.paddingLeft
        }
        let remain = targetSize.width - this.contentSize.width - this.paddingLeft - this.paddingRight
        this.childNodes.forEach(e => {
            const childTargetSize = {
                width: width - xStart - this.paddingRight,
                height: height - this.paddingTop - this.paddingBottom,
            }
            if (e.layoutConfig?.weight > 0) {
                childTargetSize.width += remain / this.contentSize.weight * e.layoutConfig.weight
            }
            e.layoutSelf(childTargetSize)
            let gravity = e.layoutConfig?.alignment | this.gravity
            if ((gravity & TOP) === TOP) {
                e.y = 0
            } else if ((gravity & BOTTOM) === BOTTOM) {
                e.y = height - e.height + this.paddingTop - this.paddingBottom
            } else if ((gravity & CENTER_Y) === CENTER_Y) {
                e.x = height / 2 - e.height / 2 - this.paddingTop
            } else {
                if (e.layoutConfig.margin?.left) {
                    e.x = e.layoutConfig.margin?.left
                } else if (e.layoutConfig.margin?.right) {
                    e.x = width - e.width + this.paddingLeft - this.paddingRight - e.layoutConfig.margin?.right
                }
            }
            if (e.layoutConfig.margin?.left !== undefined) {
                xStart += e.layoutConfig.margin.left
            }
            e.x = xStart - this.paddingLeft
            xStart += e.width + this.space
            if (e.layoutConfig.margin?.right !== undefined) {
                xStart += e.layoutConfig.margin.right
            }
        })
    }
}