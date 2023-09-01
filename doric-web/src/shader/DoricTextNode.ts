import { DoricViewNode, LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString } from "./DoricViewNode";
import { toRGBAString } from "../utils/color";

export class DoricTextNode extends DoricViewNode {
    maxLines = 0
    textElement!: HTMLElement
    build(): HTMLElement {
        const div = document.createElement('div')
        div.style.display = "flex"
        div.style.overflow = "hidden"
        this.textElement = document.createElement('span')
        div.appendChild(this.textElement)
        div.style.justifyContent = "center"
        div.style.alignItems = "center"
        return div
    }

    blendProps(v: HTMLElement, propName: string, prop: any) {
        switch (propName) {
            case 'text':
                this.textElement.innerText = prop
                break
            case 'textSize':
                v.style.fontSize = toPixelString(prop)
                break
            case 'textColor':
                v.style.color = toRGBAString(prop)
                break
            case 'textAlignment':
                const gravity: number = prop
                if ((gravity & LEFT) === LEFT) {
                    v.style.justifyContent = "flex-start"
                } else if ((gravity & RIGHT) === RIGHT) {
                    v.style.justifyContent = "flex-end"
                } else if ((gravity & CENTER_X) === CENTER_X) {
                    v.style.justifyContent = "center"
                }
                if ((gravity & TOP) === TOP) {
                    v.style.alignItems = "flex-start"
                } else if ((gravity & BOTTOM) === BOTTOM) {
                    v.style.alignItems = "flex-end"
                } else if ((gravity & CENTER_Y) === CENTER_Y) {
                    v.style.alignItems = "center"
                }
                break
            case "font":
                this.view.style.fontFamily = prop
                break
            case "fontStyle":
                switch (prop) {
                    case "bold":
                        v.style.fontWeight = "bold"
                        v.style.fontStyle = "normal"
                        break
                    case "italic":
                        v.style.fontWeight = "normal"
                        v.style.fontStyle = "italic"
                        break
                    case "bold_italic":
                        v.style.fontWeight = "bold"
                        v.style.fontStyle = "italic"
                        break
                    default:
                        v.style.fontWeight = "normal"
                        v.style.fontStyle = "normal"
                        break
                }
                break
            case "maxLines":
                this.maxLines = prop as number
                break
            default:
                super.blendProps(v, propName, prop)
                break
        }
    }

    layout() {
        super.layout()
        Promise.resolve().then(_ => {
            this.configSize()
        })
    }

    configSize() {
        if (this.maxLines > 0) {
            const currentHeight = this.view.offsetHeight
            const computedStyle = window.getComputedStyle(this.view)
            const maxHeight = this.getLineHeight(computedStyle) * this.maxLines
            if (currentHeight > maxHeight) {
                this.view.style.height = toPixelString(maxHeight)
                this.view.style.alignItems = "flex-start"
                this.view.style.overflow = 'hidden'
                this.textElement.innerText = this.getTruncationText(computedStyle, maxHeight)
            }
        } 
    }

    getLineHeight(style:CSSStyleDeclaration) {
        const tempEle = document.createElement('div')
        tempEle.style.cssText = style.cssText
        tempEle.textContent = 'Test'
        document.body.appendChild(tempEle);
        const lineHeight = tempEle.offsetHeight;
        document.body.removeChild(tempEle);
        return lineHeight;
    }

    getTruncationText(style:CSSStyleDeclaration, maxHeight:number) {
        const originalText = this.textElement.innerText
        let start = 0, end = originalText.length

        const tempEle = document.createElement('div')
        tempEle.style.cssText = style.cssText
        tempEle.style.alignItems = "flex-start"
        tempEle.style.width = this.view.style.width
        document.body.appendChild(tempEle);

        while(start <= end) {
            const mid = Math.floor((start + end) / 2)
            tempEle.textContent = originalText.slice(0,mid) + '...'
            if (tempEle.offsetHeight > maxHeight) {
                end = mid - 1
            } else {
                start = mid + 1
            }
        }
        document.body.removeChild(tempEle)
        return `${originalText.slice(0, end) + '...'}`
    }
}