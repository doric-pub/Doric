import { DoricStackNode } from "./DoricStackNode";

export class DoricDraggableNode extends DoricStackNode {

    onDrag: string = ""
    dragging = false
    lastX = 0
    lastY = 0
    build() {
        const ret = document.createElement('div')
        ret.ontouchstart = (event) => {
            this.dragging = true
            this.lastX = event.targetTouches[0].clientX
            this.lastY = event.targetTouches[0].clientY
        }
        ret.ontouchend = (event) => {
            this.dragging = false
        }
        ret.ontouchcancel = (event) => {
            this.dragging = false
        }
        ret.ontouchmove = (event) => {
            if (this.dragging) {
                this.offsetX += (event.targetTouches[0].clientX - this.lastX)
                this.offsetY += (event.targetTouches[0].clientY - this.lastY)
                this.callJSResponse(this.onDrag, this.offsetX, this.offsetY)

                this.lastX = event.targetTouches[0].clientX
                this.lastY = event.targetTouches[0].clientY
            }
        }

        ret.onmousedown = (event) => {
            this.dragging = true
            this.lastX = event.x
            this.lastY = event.y
        }
        ret.onmousemove = (event) => {
            if (this.dragging) {
                this.offsetX += (event.x - this.lastX)
                this.offsetY += (event.y - this.lastY)
                this.callJSResponse(this.onDrag, this.offsetX, this.offsetY)

                this.lastX = event.x
                this.lastY = event.y
            }
        }
        ret.onmouseup = (event) => {
            this.dragging = false
        }
        ret.onmouseout = (event) => {
            this.dragging = false
        }
        ret.style.position = "relative"
        return ret
    }

    blendProps(v: HTMLElement, propName: string, prop: any) {
        switch (propName) {
            case 'onDrag':
                this.onDrag = prop
                break
            default:
                super.blendProps(v, propName, prop)
                break
        }
    }
}