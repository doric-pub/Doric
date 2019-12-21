import { DoricViewNode, LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString, toRGBAString } from "./DoricViewNode";

export class DoricImageNode extends DoricViewNode {
    build(): HTMLElement {
        return document.createElement('img')
    }

    blendProps(v: HTMLParagraphElement, propName: string, prop: any) {
        switch (propName) {
            case 'imageUrl':
                v.setAttribute('src', prop)
                break
            case 'imageBase64':
                v.setAttribute('src', prop)
                break
            case 'loadCallback':
                v.onload = () => {
                    this.callJSResponse(prop)
                }
                break
            default:
                super.blendProps(v, propName, prop)
                break
        }
    }

}