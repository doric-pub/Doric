import { DoricViewNode, FrameSize, toPixelString, toRGBAString } from "./DoricViewNode";

export class DoricTextNode extends DoricViewNode {

    build(): HTMLElement {
        return document.createElement('p')
    }

    blendProps(v: HTMLParagraphElement, propName: string, prop: any) {
        switch (propName) {
            case 'text':
                v.innerText = prop
                break
            case 'textSize':
                v.style.fontSize = toPixelString(prop)
                break
            case 'textColor':
                v.style.color = toRGBAString(prop)
                break
            default:
                super.blendProps(v, propName, prop)
                break
        }
    }

}