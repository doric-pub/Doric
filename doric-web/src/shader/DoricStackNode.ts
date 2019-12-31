import { DoricGroupViewNode, LayoutSpec, FrameSize, LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString } from "./DoricViewNode";

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
                return Math.max(prev, current.view.offsetWidth)
            }, 0)
            this.view.style.width = toPixelString(width)
        }
        if (this.layoutConfig.heightSpec === LayoutSpec.WRAP_CONTENT) {
            const height = this.childNodes.reduce((prev, current) => {
                return Math.max(prev, current.view.offsetHeight)
            }, 0)
            this.view.style.height = toPixelString(height)
        }
    }

    configOffset() {
        this.childNodes.forEach(e => {
            e.view.style.position = "absolute"
            e.view.style.left = toPixelString(e.offsetX + this.paddingLeft)
            e.view.style.top = toPixelString(e.offsetY + this.paddingTop)
            const gravity = e.layoutConfig.alignment
            if ((gravity & LEFT) === LEFT) {
                e.view.style.left = toPixelString(0)
            } else if ((gravity & RIGHT) === RIGHT) {
                e.view.style.left = toPixelString(this.view.offsetWidth - e.view.offsetWidth)
            } else if ((gravity & CENTER_X) === CENTER_X) {
                e.view.style.left = toPixelString(this.view.offsetWidth / 2 - e.view.offsetWidth / 2)
            }
            if ((gravity & TOP) === TOP) {
                e.view.style.top = toPixelString(0)
            } else if ((gravity & BOTTOM) === BOTTOM) {
                e.view.style.top = toPixelString(this.view.offsetHeight - e.view.offsetHeight)
            } else if ((gravity & CENTER_Y) === CENTER_Y) {
                e.view.style.top = toPixelString(this.view.offsetHeight / 2 - e.view.offsetHeight / 2)
            }
        })
    }
}