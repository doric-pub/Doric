import { DoricViewNode } from "./DoricViewNode";

export class DoricSwitchNode extends DoricViewNode {
    input?: HTMLInputElement
    box?: HTMLDivElement
    span?: HTMLSpanElement
    onSwitchFuncId?: string

    build() {
        const ret = document.createElement('div')
        ret.style.position = "relative"
        ret.style.width = "50px"
        ret.style.height = "30px"
        const input = document.createElement('input')
        input.type = "checkbox"
        input.style.display = "none"
        const box = document.createElement('div')
        box.style.width = "100%"
        box.style.height = "100%"
        box.style.backgroundColor = "#ccc"
        box.style.borderRadius = "15px"
        const span = document.createElement('span')
        span.style.display = "inline-block"
        span.style.height = "30px"
        span.style.width = "30px"
        span.style.borderRadius = "15px"
        span.style.background = "#fff"
        box.appendChild(span)
        ret.appendChild(input)
        ret.appendChild(box)
        ret.onclick = () => {
            if (input.checked === false) {
                span.animate(
                    [{ transform: "translateX(30px)" }], {
                    duration: 200,
                    fill: "forwards"
                })
                box.animate([{ backgroundColor: "forestgreen" }], {
                    duration: 200,
                    fill: "forwards"
                })
                input.checked = true
            } else {
                span.animate([{ transform: "translateX(0px)" }], {
                    duration: 200,
                    fill: "forwards"
                })
                box.animate([{ backgroundColor: "#ccc" }], {
                    duration: 200,
                    fill: "forwards"
                })
                input.checked = false
            }
            if (this.onSwitchFuncId) {
                this.callJSResponse(this.onSwitchFuncId, input.checked)
            }
        }
        this.input = input
        this.span = span
        this.box = box
        return ret
    }

    private setChecked(v: boolean) {
        if (!this.input || !this.span || !this.box) {
            return
        }
        if (this.input.checked === false) {
            this.span.style.transform = "translateX(30px)"
            this.box.style.backgroundColor = "forestgreen"
            this.input.checked = true
        } else {
            this.span.style.transform = "translateX(0px)"
            this.box.style.backgroundColor = "#ccc"
            this.input.checked = false
        }
    }

    blendProps(v: HTMLElement, propName: string, prop: any) {
        switch (propName) {
            case "state":
                this.setChecked(prop)
                break
            case "onSwitch":
                this.onSwitchFuncId = prop
                break
            case "offTintColor":
                break
            case "onTintColor":
                break
            case "thumbTintColor":
                break
            default:
                super.blendProps(v, propName, prop)
                break
        }
    }

    getState() {
        return this.input?.checked || false
    }
}
