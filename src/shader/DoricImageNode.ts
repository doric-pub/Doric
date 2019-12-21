import { DoricViewNode, LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString, toRGBAString } from "./DoricViewNode";

enum ScaleType {
    ScaleToFill = 0,
    ScaleAspectFit,
    ScaleAspectFill,
}

export class DoricImageNode extends DoricViewNode {

    build(): HTMLElement {
        const ret = document.createElement('img')
        ret.style.objectFit = "fill"
        return ret
    }

    blendProps(v: HTMLImageElement, propName: string, prop: any) {
        switch (propName) {
            case 'imageUrl':
                v.setAttribute('src', prop)
                break
            case 'imageBase64':
                v.setAttribute('src', prop)
                break
            case 'loadCallback':
                v.onload = () => {
                    this.callJSResponse(prop, {
                        width: v.width,
                        height: v.height
                    })
                }
                break
            case 'scaleType':
                switch (prop) {
                    case ScaleType.ScaleToFill:
                        v.style.objectFit = "fill"
                        break
                    case ScaleType.ScaleAspectFit:
                        v.style.objectFit = "contain"
                        break
                    case ScaleType.ScaleAspectFill:
                        v.style.objectFit = "cover"
                        break
                }
                break
            case 'isBlur':
                if (prop) {
                    v.style.filter = 'blur(8px)'
                } else {
                    v.style.filter = ''
                }
                break
            default:
                super.blendProps(v, propName, prop)
                break
        }
    }

}