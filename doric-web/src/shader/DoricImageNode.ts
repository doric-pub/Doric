import { DoricViewNode, LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString } from './DoricViewNode'
import { toRGBAString } from '../utils/color'

enum ScaleType {
    ScaleToFill = 0,
    ScaleAspectFit,
    ScaleAspectFill,
}

export class DoricImageNode extends DoricViewNode {
    onloadFuncId?: string
    placeHolderImage?: string
    placeHolderImageBase64?: string
    placeHolderColor?: number
    errorImage?: string
    errorImageBase64?: string
    errorColor?: number

    build(): HTMLElement {
        const ret = document.createElement('img')
        ret.style.objectFit = "fill"
        return ret
    }

    blend(props: { [index: string]: any }): void {
        this.placeHolderImage = props['placeHolderImage']
        this.placeHolderImageBase64 = props['placeHolderImageBase64']
        this.placeHolderColor = props['placeHolderColor']
        this.errorImage = props['errorImage']
        this.errorImageBase64 = props['errorImageBase64']
        this.errorColor = props['errorColor']
        super.blend(props)
    }

    blendProps(v: HTMLImageElement, propName: string, prop: any) {
        switch (propName) {
            case 'imageUrl':
            case 'imageBase64':
                this.loadIntoTarget(v, prop)
                break
            case 'placeHolderImage':
            case 'placeHolderImageBase64':
            case 'placeHolderColor':
            case 'errorImage':
            case 'errorImageBase64':
            case 'errorColor':
                break
            case 'loadCallback':
                this.onloadFuncId = prop
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

    private loadIntoTarget(v: HTMLImageElement, src: any) {
        let placeHolderSrc = ''
        if (this.placeHolderImage) {
            placeHolderSrc = v.src = this.placeHolderImage
        } else if (this.placeHolderImageBase64) {
            placeHolderSrc = v.src = this.placeHolderImageBase64
        } else if (this.placeHolderColor) {
            v.style.backgroundColor = toRGBAString(this.placeHolderColor)
        }
        v.onload = () => {
            if (this.placeHolderColor) {
                v.style.removeProperty('background-color')
            }
            if (this.onloadFuncId) {
                this.callJSResponse(this.onloadFuncId, {
                    width: v.width,
                    height: v.height,
                })
            }
        }
        v.onerror = () => {
            const error = this.getError(v.offsetWidth, v.offsetHeight)
            if (!error) return
            const same = src === error
            const srcLoadError = v.src === src
            if (same || !srcLoadError) return
            v.src = error
        }
        setTimeout(() => {
            v.src = src
        })
    }

    private getError(width: number, height: number) {
        if (this.errorImage) {
            return this.errorImage
        } else if (this.errorImageBase64) {
            return this.errorImageBase64
        } else if (this.errorColor && this.view) {
            return this.createColoredCanvas(
                width, height,
                this.errorColor
            )
        }
        return null
    }

    private createColoredCanvas(width: number, height: number, color: number) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d')
        if (context) {
            context.fillStyle = toRGBAString(color)
            context.fillRect(0, 0, width, height)
            return canvas.toDataURL('image/png')
        }

        return null
    }

}
