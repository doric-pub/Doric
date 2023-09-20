import { DoricViewNode } from './DoricViewNode'
import { LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString } from './DoricLayouts'
import { toRGBAString } from '../utils/color'
import { resourceManager } from '../DoricRegistry'
import Size from '../utils/Size'

enum ScaleType {
    ScaleToFill = 0,
    ScaleAspectFit,
    ScaleAspectFill,
}
type StretchInset = {
    [key: string]: number;
    left: number,
    top: number,
    right: number,
    bottom: number
}
const transparentBase64 = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
export class DoricImageNode extends DoricViewNode {
    onloadFuncId?: string
    placeHolderImage?: string
    placeHolderImageBase64?: string
    placeHolderColor?: number
    errorImage?: string
    errorImageBase64?: string
    errorColor?: number
    stretchInset?: StretchInset
    resizeObserver?: ResizeObserver | null

    build(): HTMLElement {
        const ret = document.createElement('img')
        ret.style.objectFit = 'fill'
        return ret
    }

    blend(props: { [index: string]: any }): void {
        this.placeHolderImage = props['placeHolderImage']
        this.placeHolderImageBase64 = props['placeHolderImageBase64']
        this.placeHolderColor = props['placeHolderColor']
        this.errorImage = props['errorImage']
        this.errorImageBase64 = props['errorImageBase64']
        this.errorColor = props['errorColor']
        this.stretchInset = props['stretchInset']
        super.blend(props)
    }

    blendProps(v: HTMLImageElement, propName: string, prop: any) {
        switch (propName) {
            case 'image':
                resourceManager.load(prop)?.then(e => {
                    this.loadIntoTarget(v, e)
                }).catch(e => {
                    this.loadIntoTarget(v, '')
                })
                break
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
            case 'stretchInset':
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

    private loadIntoTarget(targetElement: HTMLImageElement, src: any) {
        this.clearStretchElementAttributes(targetElement)
        this.loadPlaceHolder(targetElement)
        let tempLoadElement = this.stretchInset ? document.createElement('img') : targetElement
        tempLoadElement.onload = () => {
            if (this.stretchInset) {
                if (!this.resizeObserver) {
                    this.resizeObserver = new ResizeObserver(entry => {
                        this.onResize.call(this, { width: tempLoadElement.naturalWidth, height: tempLoadElement.naturalHeight })
                    })
                    this.resizeObserver.observe(targetElement)
                }
                this.onResize({ width: tempLoadElement.naturalWidth, height: tempLoadElement.naturalHeight })
            }
            //remove placeHolderColor
            targetElement.style.removeProperty('background-color')
            if (tempLoadElement.src === src && this.onloadFuncId) {
                this.callJSResponse(this.onloadFuncId, {
                    width: tempLoadElement.naturalWidth,
                    height: tempLoadElement.naturalHeight,
                })
            }
        }
        tempLoadElement.onerror = () => {
            this.clearStretchElementAttributes(targetElement)
            const error = this.getError(targetElement.offsetWidth, targetElement.offsetHeight)
            if (!error) return
            const same = src === error
            const srcLoadError = tempLoadElement.src.length === 0 || tempLoadElement.src === src
            if (same || !srcLoadError) return
            targetElement.src = error
            if (this.onloadFuncId) {
                this.callJSResponse(this.onloadFuncId)
            }
        }
        Promise.resolve().then(e => {
            tempLoadElement.src = src
            if (this.stretchInset) {
                this.loadImageWithStretch(targetElement, src, this.stretchInset)
            }
        })
    }

    private loadImageWithStretch(v: HTMLImageElement, src: any, stretchInset: StretchInset) {
        v.src = transparentBase64
        v.style.borderImageSource = `url(${src})`
        v.style.borderImageSlice = `${stretchInset.top} ${stretchInset.right} ${stretchInset.bottom} ${stretchInset.left} fill`
    }

    private calculateStretchBorderWidth(originalSize: Size, targetSize: Size, stretchInset: StretchInset) {
        const widthRatio = targetSize.width / originalSize.width
        const heightRatio = targetSize.height / originalSize.height
        const scaleFactor = Math.min(widthRatio, heightRatio)
        const scaledStretchInset: { [key: string]: number; } = {}
        for (const key in stretchInset) {
            scaledStretchInset[key] = Math.round(stretchInset[key] * scaleFactor)
        }
        return scaledStretchInset

    }

    private loadPlaceHolder(v: HTMLImageElement) {
        if (this.placeHolderImage) {
            v.src = this.placeHolderImage
        } else if (this.placeHolderImageBase64) {
            v.src = this.placeHolderImageBase64
        } else if (this.placeHolderColor) {
            v.style.backgroundColor = toRGBAString(this.placeHolderColor)
        }
    }

    private clearStretchElementAttributes(v: HTMLImageElement) {
        v.style.removeProperty('background-color')
        v.style.removeProperty('border-image-source')
        v.style.removeProperty('border-image-slice')
        v.style.removeProperty('border-image-width')
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

    private onResize(originalSize: Size) {
        if (!this.stretchInset) {
            return
        }
        if (this.view.offsetWidth !== 0 || this.view.offsetHeight !== 0) {
            const scaledStretchInset = this.calculateStretchBorderWidth(
                { width: originalSize.width, height: originalSize.height },
                { width: this.view.offsetWidth, height: this.view.offsetHeight },
                this.stretchInset)
            const top = toPixelString(scaledStretchInset.top)
            const right = toPixelString(scaledStretchInset.right)
            const bottom = toPixelString(scaledStretchInset.bottom)
            const left = toPixelString(scaledStretchInset.left)
            this.view.style.borderImageWidth = `${top} ${right} ${bottom} ${left}`
        }
    }

}
