import { DoricGroupViewNode, LayoutSpec, FrameSize, LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString } from "./DoricViewNode";

export class DoricStackNode extends DoricGroupViewNode {

    build() {
        const ret = document.createElement('div')
        ret.style.position = "relative"
        return ret
    }

    layout() {
        super.layout()
        this.configOffset()
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