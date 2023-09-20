import { DoricGroupViewNode } from "./DoricViewNode";
import { LayoutSpec, FrameSize, LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString, pixelString2Number } from "./DoricLayouts";

export class DoricStackNode extends DoricGroupViewNode {

    build() {
        const ret = document.createElement('div')
        ret.style.position = "relative"
        return ret
    }

    layout() {
        super.layout()
        Promise.resolve().then(_ => {
            this.configSize()
            this.configOffset()
        })
    }

    configSize() {
        if (this.layoutConfig.widthSpec === LayoutSpec.WRAP_CONTENT) {
            const width = this.childNodes.reduce((prev, current) => {
                const computedStyle = window.getComputedStyle(current.view)
                return Math.max(prev, current.view.offsetWidth
                    + pixelString2Number(computedStyle.marginLeft)
                    + pixelString2Number(computedStyle.marginRight))
            }, 0)
            this.view.style.width = toPixelString(width)
        }
        if (this.layoutConfig.heightSpec === LayoutSpec.WRAP_CONTENT) {
            const height = this.childNodes.reduce((prev, current) => {
                const computedStyle = window.getComputedStyle(current.view)
                return Math.max(prev, current.view.offsetHeight
                    + pixelString2Number(computedStyle.marginTop)
                    + pixelString2Number(computedStyle.marginBottom))
            }, 0)
            this.view.style.height = toPixelString(height)
        }
    }

    configOffset() {
        this.childNodes.forEach(e => {
            const position = "absolute"
            let left = toPixelString(e.offsetX + this.paddingLeft)
            let top = toPixelString(e.offsetY + this.paddingTop)
            const gravity = e.layoutConfig.alignment
            if ((gravity & LEFT) === LEFT) {
                left = toPixelString(0)
            } else if ((gravity & RIGHT) === RIGHT) {
                //ignore marginLeft
                const childMarginRight = pixelString2Number(window.getComputedStyle(e.view).marginRight)
                left = toPixelString(this.view.offsetWidth - e.view.offsetWidth - childMarginRight)
            } else if ((gravity & CENTER_X) === CENTER_X) {
                const childMarginLeft = pixelString2Number(window.getComputedStyle(e.view).marginLeft)
                const childMarginRight = pixelString2Number(window.getComputedStyle(e.view).marginRight)
                left = toPixelString(this.view.offsetWidth / 2 - e.view.offsetWidth / 2 + childMarginLeft - childMarginRight)
            }
            if ((gravity & TOP) === TOP) {
                top = toPixelString(0)
            } else if ((gravity & BOTTOM) === BOTTOM) {
                //ignore marginTop
                const childMarginTop = pixelString2Number(window.getComputedStyle(e.view).marginBottom)
                top = toPixelString(this.view.offsetHeight - e.view.offsetHeight - childMarginTop)
            } else if ((gravity & CENTER_Y) === CENTER_Y) {
                const childMarginTop = pixelString2Number(window.getComputedStyle(e.view).marginTop)
                const childMarginBottom = pixelString2Number(window.getComputedStyle(e.view).marginBottom)
                top = toPixelString(this.view.offsetHeight / 2 - e.view.offsetHeight / 2 + childMarginTop - childMarginBottom)
            }
            e.applyCSSStyle({
                position,
                left,
                top,
            })
        })
    }
}