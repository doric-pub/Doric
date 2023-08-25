import { DoricContext } from "../DoricContext";
import { acquireViewNode } from "../DoricRegistry";
import { GradientColor, GradientOrientation, generateGradientColorDesc, generateGradientOrientationDesc } from "../utils/color";
import { toRGBAString } from "../utils/color";

export enum LayoutSpec {
    EXACTLY = 0,
    WRAP_CONTENT = 1,
    AT_MOST = 2,
}

const SPECIFIED = 1
const START = 1 << 1
const END = 1 << 2

const SHIFT_X = 0
const SHIFT_Y = 4

export const LEFT = (START | SPECIFIED) << SHIFT_X
export const RIGHT = (END | SPECIFIED) << SHIFT_X

export const TOP = (START | SPECIFIED) << SHIFT_Y
export const BOTTOM = (END | SPECIFIED) << SHIFT_Y

export const CENTER_X = SPECIFIED << SHIFT_X
export const CENTER_Y = SPECIFIED << SHIFT_Y

export const CENTER = CENTER_X | CENTER_Y

export type FrameSize = {
    width: number,
    height: number,
}
export function toPixelString(v: number) {
    return `${v}px`
}

export function pixelString2Number(v: string) {
    return parseFloat(v.substring(0, v.indexOf("px")))
}

export type DoricViewNodeClass = { new(...args: any[]): {} }

export interface DVModel {
    id: string,
    type: string,
    props: {
        [index: string]: any
    },
}

export abstract class DoricViewNode {
    viewId = ""
    viewType = "View"
    context: DoricContext
    superNode?: DoricSuperNode
    layoutConfig = {
        widthSpec: LayoutSpec.EXACTLY,
        heightSpec: LayoutSpec.EXACTLY,
        alignment: 0,
        weight: 0,
        margin: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
    }
    padding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }

    border?: {
        width: number,
        color: number,
    }

    frameWidth = 0

    frameHeight = 0

    offsetX = 0

    offsetY = 0

    view!: HTMLElement

    _originDisplay: string = ""

    transform: {
        translateX?: number,
        translateY?: number,
        scaleX?: number,
        scaleY?: number,
        rotation?: number,
        rotationX?: number,
        rotationY?: number
    } = {}

    transformOrigin: { x: number, y: number } | undefined

    constructor(context: DoricContext) {
        this.context = context
    }

    init(superNode?: DoricSuperNode) {
        if (superNode) {
            this.superNode = superNode
            if (this instanceof DoricSuperNode) {
                this.reusable = superNode.reusable
            }
        }
        this.view = this.build()
        this._originDisplay = this.view.style.display
    }

    abstract build(): HTMLElement

    get paddingLeft() {
        return this.padding.left || 0
    }

    get paddingRight() {
        return this.padding.right || 0
    }

    get paddingTop() {
        return this.padding.top || 0
    }

    get paddingBottom() {
        return this.padding.bottom || 0
    }

    get borderWidth() {
        return this.border?.width || 0
    }

    blend(props: { [index: string]: any }) {
        this.view.id = `${this.viewId}`
        for (let key in props) {
            this.blendProps(this.view, key, props[key])
        }
        this.onBlending()
        this.layout()
    }

    onBlending() {
        this.updateTransform()
    }

    onBlended() {
    }

    configBorder() {
        if (this.border) {
            this.applyCSSStyle({
                borderStyle: "solid",
                borderWidth: toPixelString(this.border.width),
                borderColor: toRGBAString(this.border.color),
            })
        }
    }

    configWidth() {
        let width: string
        switch (this.layoutConfig.widthSpec) {
            case LayoutSpec.WRAP_CONTENT:
                width = "max-content"
                break

            case LayoutSpec.AT_MOST:
                width = "100%"
                break

            case LayoutSpec.EXACTLY:
            default:
                width = toPixelString(this.frameWidth
                    - this.paddingLeft - this.paddingRight
                    - this.borderWidth * 2)
                break
        }
        this.applyCSSStyle({ width })
    }

    configHeight() {
        let height
        switch (this.layoutConfig.heightSpec) {
            case LayoutSpec.WRAP_CONTENT:
                height = "max-content"
                break

            case LayoutSpec.AT_MOST:
                height = "100%"
                break

            case LayoutSpec.EXACTLY:
            default:
                height = toPixelString(this.frameHeight
                    - this.paddingTop - this.paddingBottom
                    - this.borderWidth * 2)
                break
        }
        this.applyCSSStyle({ height })
    }

    configMargin() {
        if (this.layoutConfig.margin) {
            this.applyCSSStyle({
                marginLeft: toPixelString(this.layoutConfig.margin.left || 0),
                marginRight: toPixelString(this.layoutConfig.margin.right || 0),
                marginTop: toPixelString(this.layoutConfig.margin.top || 0),
                marginBottom: toPixelString(this.layoutConfig.margin.bottom || 0),
            })
        }
    }

    configPadding() {
        if (this.padding) {
            this.applyCSSStyle({
                paddingLeft: toPixelString(this.paddingLeft),
                paddingRight: toPixelString(this.paddingRight),
                paddingTop: toPixelString(this.paddingTop),
                paddingBottom: toPixelString(this.paddingBottom),
            })
        }
    }

    layout() {
        this.configMargin()
        this.configBorder()
        this.configPadding()
        this.configWidth()
        this.configHeight()
    }

    blendProps(v: HTMLElement, propName: string, prop: any) {
        switch (propName) {
            case "border":
                this.border = prop
                break
            case "padding":
                this.padding = prop
                break
            case 'width':
                this.frameWidth = prop as number
                break
            case 'height':
                this.frameHeight = prop as number
                break
            case 'backgroundColor':
                this.backgroundColor = prop
                
                break
            case 'layoutConfig':
                const layoutConfig = prop
                for (let key in layoutConfig) {
                    Reflect.set(this.layoutConfig, key, Reflect.get(layoutConfig, key, layoutConfig))
                }
                break
            case 'x':
                this.offsetX = prop as number
                break
            case 'y':
                this.offsetY = prop as number
                break
            case 'onClick':
                this.view.onclick = (event: Event) => {
                    this.callJSResponse(prop as string)
                    event.stopPropagation()
                }
                break
            case 'corners':
                if (typeof prop === 'object') {
                    this.applyCSSStyle({
                        borderTopLeftRadius: toPixelString(prop.leftTop),
                        borderTopRightRadius: toPixelString(prop.rightTop),
                        borderBottomRightRadius: toPixelString(prop.rightBottom),
                        borderBottomLeftRadius: toPixelString(prop.leftBottom),
                    })
                } else {
                    this.applyCSSStyle({ borderRadius: toPixelString(prop) })
                }
                break
            case 'shadow':
                const opacity = prop.opacity || 0
                let boxShadow
                if (opacity > 0) {
                    const offsetX = prop.offsetX || 0
                    const offsetY = prop.offsetY || 0
                    const shadowColor = prop.color || 0xff000000
                    const shadowRadius = prop.radius
                    const alpha = opacity * 255
                    boxShadow = `${toPixelString(offsetX)} ${toPixelString(offsetY)} ${toPixelString(shadowRadius)} ${toRGBAString((shadowColor & 0xffffff) | ((alpha & 0xff) << 24))} `
                } else {
                    boxShadow = ""
                }
                this.applyCSSStyle({
                    boxShadow,
                })
                break
            case 'alpha':
                this.applyCSSStyle({
                    opacity: `${prop}`,
                })
                break
            case 'rotation':
                this.transform.rotation = prop
                break
            case 'rotationX':
                this.transform.rotationX = prop
                break
            case 'rotationY':
                this.transform.rotationY = prop
                break
            case 'scaleX':
                this.transform.scaleX = prop
                break
            case 'scaleY':
                this.transform.scaleY = prop
                break
            case 'translationX':
                this.transform.translateX = prop
                break
            case 'translationY':
                this.transform.translateY = prop
                break
            case 'pivotX':
                if (this.transformOrigin) {
                    this.transformOrigin.x = prop
                } else {
                    this.transformOrigin = {
                        x: prop,
                        y: 0.5,
                    }
                }
                break
            case 'pivotY':
                if (this.transformOrigin) {
                    this.transformOrigin.y = prop
                } else {
                    this.transformOrigin = {
                        x: 0.5,
                        y: prop,
                    }
                }
                break
            case 'hidden':
                this.applyCSSStyle({
                    display: prop === true ? "none" : this._originDisplay
                })
                break
            default:
                console.error(`Cannot blend prop for ${propName}`)
                break
        }
    }

    set backgroundColor(v: number | GradientColor) {
        if (typeof v === 'number') {
            this.applyCSSStyle({ backgroundColor: toRGBAString(v) });
        } else {
            let colorsParam:string[] = []
            const {start, end, colors, locations, orientation = 0} = v
            if (colors) {
                colorsParam = colors.map((c:number) => {
                    return toRGBAString(c)
                })
            } else if (typeof start === 'number' && typeof end === 'number') {                  
                colorsParam.push(...[toRGBAString(start), toRGBAString(end)])
            }
            this.applyCSSStyle({ backgroundImage: `linear-gradient(${generateGradientOrientationDesc(orientation)}, ${generateGradientColorDesc(colorsParam, locations)})`})
        }  
    }

    static create(context: DoricContext, type: string) {
        const viewNodeClass = acquireViewNode(type)
        if (viewNodeClass === undefined) {
            console.error(`Cannot find ViewNode for ${type}`)
            return undefined
        }
        const ret = new viewNodeClass(context) as DoricViewNode
        ret.viewType = type
        return ret
    }

    getIdList() {
        const ids: string[] = []
        let viewNode: DoricViewNode | undefined = this
        do {
            ids.push(viewNode.viewId)
            viewNode = viewNode.superNode
        } while (viewNode)
        return ids.reverse()
    }

    callJSResponse(funcId: string, ...args: any) {
        const argumentsList: any = ['__response__', this.getIdList(), funcId]
        for (let i = 1; i < arguments.length; i++) {
            argumentsList.push(arguments[i])
        }
        return Reflect.apply(this.context.invokeEntityMethod, this.context, argumentsList)
    }

    pureCallJSResponse(funcId: string, ...args: any) {
        const argumentsList: any = ['__response__', this.getIdList(), funcId]
        for (let i = 1; i < arguments.length; i++) {
            argumentsList.push(arguments[i])
        }
        return Reflect.apply(this.context.pureInvokeEntityMethod, this.context, argumentsList)
    }


    updateTransform() {
        this.applyCSSStyle({
            transform: Object.entries(this.transform).filter((e: [string, number?]) => !!e[1]).map((e: [string, number?]) => {
                const v = e[1] || 0
                switch (e[0]) {
                    case "translateX":
                        return `translateX(${v}px)`
                    case "scaleX":
                        return `scaleX(${v})`
                    case "scaleY":
                        return `scaleY(${v})`
                    case "rotation":
                        return `rotate(${v / 2}turn)`
                    case "rotationX":
                        return `rotateX(${v / 2}turn)`
                    case "rotationY":
                        return `rotateY(${v / 2}turn)`
                    default:
                        console.error(`Do not support transform ${e[0]}`)
                        return ""
                }
            }).join(" ")
        })
    }

    updateTransformOrigin() {
        if (this.transformOrigin) {
            this.applyCSSStyle({
                transformOrigin: `${Math.round(this.transformOrigin.x * 100)}% ${Math.round(this.transformOrigin.y * 100)}%`
            })
        }
    }

    applyCSSStyle(cssStyle: Partial<CSSStyleDeclaration>) {
        if (this.context.inAnimation()) {
            this.context.addAnimation(this, cssStyle)
        } else {
            for (let v in cssStyle) {
                Reflect.set(this.view.style, v, cssStyle[v])
            }
        }
    }
    /** ++++++++++call from doric ++++++++++*/
    getWidth() {
        return this.view.offsetWidth
    }

    getHeight() {
        return this.view.offsetHeight
    }

    setWidth(v: number) {
        this.view.style.width = toPixelString(v)
    }

    setHeight(v: number) {
        this.view.style.height = toPixelString(v)
    }

    getX() {
        return this.view.offsetLeft
    }

    getY() {
        return this.view.offsetTop
    }

    setX(v: number) {
        this.view.style.left = toPixelString(v)
    }

    setY(v: number) {
        this.view.style.top = toPixelString(v)
    }

    getBackgroundColor() {
        return this.view.style.backgroundColor
    }

    setBackgroundColor(v: number | GradientColor) {
        this.backgroundColor = v
    }

    getAlpha() {
        return parseFloat(this.view.style.opacity)
    }

    setAlpha(v: number) {
        this.view.style.opacity = `${v}`
    }

    getCorners() {
        return parseFloat(this.view.style.borderRadius)
    }

    setCorners(v: number) {
        this.view.style.borderRadius = toPixelString(v)
    }

    getLocationOnScreen() {
        const rect = this.view.getClientRects()[0]
        return {
            x: rect.left,
            y: rect.top,
        }
    }

    getRotation() {
        return this.transform.rotation
    }

    setRotation(v: number) {
        this.transform.rotation = v
        this.updateTransform()
    }

    getRotationX() {
        return this.transform.rotationX
    }

    setRotationX(v: number) {
        this.transform.rotationX = v
        this.updateTransform()
    }

    getRotationY() {
        return this.transform.rotationY
    }

    setRotationY(v: number) {
        this.transform.rotationY = v
        this.updateTransform()
    }

    getTranslationX() {
        return this.transform.translateX
    }

    setTranslationX(v: number) {
        this.transform.translateX = v
        this.updateTransform()
    }

    getTranslationY() {
        return this.transform.translateY
    }

    setTranslationY(v: number) {
        this.transform.translateY = v
        this.updateTransform()
    }

    getScaleX() {
        return this.transform.scaleX
    }

    setScaleX(v: number) {
        this.transform.scaleX = v
        this.updateTransform()
    }

    getScaleY() {
        return this.transform.scaleY
    }

    setScaleY(v: number) {
        this.transform.scaleY = v
        this.updateTransform()
    }

    getPivotX() {
        return this.transformOrigin?.x || 0.5
    }

    setPivotX(v: number) {
        if (this.transformOrigin) {
            this.transformOrigin.x = v
        } else {
            this.transformOrigin = {
                x: v,
                y: 0.5,
            }
        }
        this.updateTransform()
    }

    getPivotY() {
        return this.transformOrigin?.y || 0.5
    }

    setPivotY(v: number) {
        if (this.transformOrigin) {
            this.transformOrigin.y = v
        } else {
            this.transformOrigin = {
                x: 0.5,
                y: v,
            }
        }
        this.updateTransform()
    }
    /** ----------call from doric ----------*/
}


export abstract class DoricSuperNode extends DoricViewNode {
    reusable = false

    subModels: Map<String, DVModel> = new Map

    blendProps(v: HTMLElement, propName: string, prop: any) {
        if (propName === 'subviews') {
            if (prop instanceof Array) {
                prop.forEach((e: DVModel) => {
                    this.mixinSubModel(e)
                    this.blendSubNode(e)
                })
            }
        } else {
            super.blendProps(v, propName, prop)
        }
    }

    mixinSubModel(subNode: DVModel) {
        const oldValue = this.getSubModel(subNode.id)
        if (oldValue) {
            this.mixin(subNode, oldValue)
        } else {
            this.subModels.set(subNode.id, subNode)
        }
    }

    getSubModel(id: string) {
        return this.subModels.get(id)
    }

    mixin(src: DVModel, target: DVModel) {
        for (let key in src.props) {
            if (key === "subviews") {
                continue
            }
            Reflect.set(target.props, key, Reflect.get(src.props, key))
        }
    }
    clearSubModels() {
        this.subModels.clear()
    }

    removeSubModel(id: string) {
        this.subModels.delete(id)
    }

    abstract blendSubNode(model: DVModel): void

    abstract getSubNodeById(viewId: string): DoricViewNode | undefined
}

export abstract class DoricGroupViewNode extends DoricSuperNode {
    childNodes: DoricViewNode[] = []
    childViewIds: string[] = []

    init(superNode?: DoricSuperNode) {
        super.init(superNode)
        this.view.style.overflow = "hidden"
    }


    blendProps(v: HTMLElement, propName: string, prop: any) {
        if (propName === 'children') {
            if (prop instanceof Array) {
                this.childViewIds = prop
            }
        } else {
            super.blendProps(v, propName, prop)
        }
    }

    blend(props: { [index: string]: any }) {
        super.blend(props)
    }

    onBlending() {
        super.onBlending()
        this.configChildNode()
    }

    onBlended() {
        super.onBlended()
        this.childNodes.forEach(e => e.onBlended())
    }

    configChildNode() {
        this.childViewIds.forEach((childViewId, index) => {
            const model = this.getSubModel(childViewId)
            if (model === undefined) {
                return
            }
            if (index < this.childNodes.length) {
                const oldNode = this.childNodes[index]
                if (oldNode.viewId === childViewId) {
                    //The same,skip
                } else {
                    if (this.reusable) {
                        if (oldNode.viewType === model.type) {
                            //Same type,can be reused
                            oldNode.viewId = childViewId
                            oldNode.blend(model.props)
                        } else {
                            //Replace this view
                            this.view.removeChild(oldNode.view)
                            const newNode = DoricViewNode.create(this.context, model.type)
                            if (newNode === undefined) {
                                return
                            }
                            newNode.viewId = childViewId
                            newNode.init(this)
                            newNode.blend(model.props)
                            this.childNodes[index] = newNode
                            this.view.replaceChild(newNode.view, oldNode.view)
                        }
                    } else {
                        //Find in remain nodes
                        let position = -1
                        for (let start = index + 1; start < this.childNodes.length; start++) {
                            if (childViewId === this.childNodes[start].viewId) {
                                //Found
                                position = start
                                break
                            }
                        }
                        if (position >= 0) {
                            //Found swap idx,position
                            const reused = this.childNodes[position]
                            const abandoned = this.childNodes[index]
                            this.childNodes[index] = reused
                            this.childNodes[position] = abandoned
                            this.view.removeChild(reused.view)
                            this.view.insertBefore(reused.view, abandoned.view)
                            this.view.removeChild(abandoned.view)
                            if (position === this.view.childElementCount - 1) {
                                this.view.appendChild(abandoned.view)
                            } else {
                                this.view.insertBefore(abandoned.view, this.view.children[position])
                            }
                        } else {
                            //Not found,insert
                            const newNode = DoricViewNode.create(this.context, model.type)
                            if (newNode === undefined) {
                                return
                            }
                            newNode.viewId = childViewId
                            newNode.init(this)
                            newNode.blend(model.props)
                            this.childNodes[index] = newNode
                            this.view.insertBefore(newNode.view, this.view.children[index])
                        }
                    }
                }
            } else {
                //Insert
                const newNode = DoricViewNode.create(this.context, model.type)
                if (newNode === undefined) {
                    return
                }
                newNode.viewId = childViewId
                newNode.init(this)
                newNode.blend(model.props)
                this.childNodes.push(newNode)
                this.view.appendChild(newNode.view)
            }
        })
        let size = this.childNodes.length
        for (let idx = this.childViewIds.length; idx < size; idx++) {
            this.view.removeChild(this.childNodes[idx].view)
        }
        this.childNodes = this.childNodes.slice(0, this.childViewIds.length)
    }

    blendSubNode(model: DVModel) {
        this.getSubNodeById(model.id)?.blend(model.props)
    }

    getSubNodeById(viewId: string) {
        return this.childNodes.filter(e => e.viewId === viewId)[0]
    }

}