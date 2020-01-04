import { DoricStackNode } from "./DoricStackNode";

export class DoricDraggableNode extends DoricStackNode {

    onDrag: string = ""
    dragging = false
    lastX = 0
    lastY = 0
    build() {
        const ret = document.createElement('div')
        ret.ontouchstart = (event) => {
            console.log("ontouchstart: " + event)
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

            this.lastX = event.x
            this.lastY = event.y
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