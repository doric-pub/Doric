import { DoricViewNode, LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString, pixelString2Number } from "./DoricViewNode";
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
                this.view.style.whiteSpace = 'normal'
                break
            case "maxWidth":
                if (prop) {
                    this.layoutConfig.maxWidth = prop
                } else {
                    this.layoutConfig.maxWidth = -1
                }
                break
            case "maxHeight":
                if (prop) {
                    this.layoutConfig.maxHeight = prop
                } else {
                    this.layoutConfig.maxHeight = -1
                }
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
            const computedStyle = window.getComputedStyle(this.view) 
            const lineHeight = this.lineHeight(computedStyle)
            let allowedMaxLines = this.maxLines
           
            const contentHeight = this.view.clientHeight - pixelString2Number(computedStyle.paddingTop) - pixelString2Number(computedStyle.paddingBottom)
            if (contentHeight > 0) {
                const contentAllowedLines = Math.floor(contentHeight / lineHeight)
                allowedMaxLines = Math.min(this.maxLines, contentAllowedLines)
            }

            const originalLines = Math.floor(this.originalHeight(computedStyle) / lineHeight)
            if (originalLines > allowedMaxLines) {
                this.textElement.innerText = this.truncationText(computedStyle, lineHeight, allowedMaxLines)
            }
        } 
    }

    lineHeight(style: CSSStyleDeclaration) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        ctx!.font = style.font
        const pureText = this.textElement.innerText.replace(/\n/g, '')
        const metrics = ctx!.measureText(pureText)
        return metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
    }
 
    originalHeight(style:CSSStyleDeclaration) {
        const tempEle = document.createElement('div')
        tempEle.style.font = style.font
        tempEle.textContent = this.textElement.innerText
        tempEle.style.whiteSpace = style.whiteSpace
        this.view.style.overflow = style.overflow
        tempEle.style.width = style.width
        document.body.appendChild(tempEle)
        
        const height = tempEle.offsetHeight
        document.body.removeChild(tempEle)
        return height
    }

    truncationText(style:CSSStyleDeclaration, lineHeight:number, maxLines:number) {
        const originalText = this.textElement.innerText
        let start = 0, end = originalText.length

        const tempEle = document.createElement('div')
        tempEle.style.font = style.font
        tempEle.style.whiteSpace = style.whiteSpace
        this.view.style.overflow = style.overflow
        tempEle.style.width = style.width
        document.body.appendChild(tempEle);

        while(start <= end) {
            const mid = Math.floor((start + end) / 2)
            tempEle.textContent = originalText.slice(0,mid) + '...'
            const lines = Math.floor(tempEle.offsetHeight / lineHeight)
            if (lines > maxLines) {
                end = mid - 1
            } else {
                start = mid + 1
            }
        }
        document.body.removeChild(tempEle)
        return `${originalText.slice(0, end) + '...'}`
    }
}