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
        })
    }
}