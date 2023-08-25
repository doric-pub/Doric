import { DoricViewNode } from "./DoricViewNode";
import { toRGBAString } from "../utils/color";

export class DoricSwitchNode extends DoricViewNode {
    input?: HTMLInputElement
    box?: HTMLDivElement
    span?: HTMLSpanElement
    onSwitchFuncId?: string

    private offTintColor = "#e6e6e6"
    private onTintColor = "#52d769"

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
        span.style.boxShadow = "0px 3px 3px #eee"
        box.appendChild(span)
        ret.appendChild(input)
        ret.appendChild(box)
        ret.onclick = () => {
            try {

                if (input.checked === false) {
                    span.animate(
                        [{ transform: "translateX(0px)" }, { transform: "translateX(30px)" }], {
                        duration: 200,
                        fill: "forwards"
                    })
                    box.animate([{ backgroundColor: this.offTintColor }, { backgroundColor: this.onTintColor }], {
                        duration: 200,
                        fill: "forwards"
                    })
                    input.checked = true
                } else {
                    span.animate([{ transform: "translateX(30px)" }, { transform: "translateX(0px)" }], {
                        duration: 200,
                        fill: "forwards"
                    })
                    box.animate([{ backgroundColor: this.onTintColor }, { backgroundColor: this.offTintColor }], {
                        duration: 200,
                        fill: "forwards"
                    })
                    input.checked = false
                }
                if (this.onSwitchFuncId) {
                    this.callJSResponse(this.onSwitchFuncId, input.checked)
                }
            } catch (e) {
                alert(e)
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
        if (v) {
            this.span.style.transform = "translateX(30px)"
            this.box.style.backgroundColor = this.onTintColor
            this.input.checked = v
        } else {
            this.span.style.transform = "translateX(0px)"
            this.box.style.backgroundColor = this.offTintColor
            this.input.checked = v
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
                this.offTintColor = toRGBAString(prop)
                this.setChecked(this.getState())
                break
            case "onTintColor":
                this.onTintColor = toRGBAString(prop)
                this.setChecked(this.getState())
                break
            case "thumbTintColor":
                if (this.span) {
                    this.span.style.backgroundColor = toRGBAString(prop)
                }
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
