import { DoricGroupViewNode, LayoutSpec, FrameSize, LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM } from "./DoricViewNode";

export class DoricStackViewNode extends DoricGroupViewNode {

    build() {
        return document.createElement('div')
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
        let contentSize = { width: 0, height: 0 }
        let limitSize = {
            width: targetSize.width - this.paddingLeft - this.paddingRight,
            height: targetSize.height - this.paddingTop - this.paddingBottom,
        }
        if (this.layoutConfig.widthSpec === LayoutSpec.WRAP_CONTENT
            || this.layoutConfig.heightSpec === LayoutSpec.WRAP_CONTENT) {
            contentSize = this.childNodes.reduce((prev, current) => {
                const size = current.measureContentSize(limitSize)
                return {
                    width: Math.max(prev.width, size.width),
                    height: Math.max(prev.height, size.height),
                }
            }, contentSize)
        }
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
        return { width, height }
    }

    layoutSelf(targetSize: FrameSize) {
        const { width, height } = this.measureContentSize(targetSize)
        this.width = width
        this.height = height
        const limitSize = {
            width: width - this.paddingLeft - this.paddingRight,
            height: height - this.paddingTop - this.paddingBottom,
        }
        this.childNodes.forEach(e => {
            e.layoutSelf(limitSize)
            let gravity = e.layoutConfig?.alignment || 0
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

            if ((gravity & TOP) === TOP) {
                e.y = 0
            } else if ((gravity & BOTTOM) === BOTTOM) {
                e.y = height - e.height + this.paddingTop - this.paddingBottom
            } else if ((gravity & CENTER_Y) === CENTER_Y) {
                e.y = height / 2 - e.height / 2 - this.paddingTop
            } else {
                if (e.layoutConfig.margin?.top) {
                    e.y = e.layoutConfig.margin?.top
                } else if (e.layoutConfig.margin?.bottom) {
                    e.y = height - e.height + this.paddingTop - this.paddingBottom - e.layoutConfig.margin?.bottom
                }
            }
        })
    }
}