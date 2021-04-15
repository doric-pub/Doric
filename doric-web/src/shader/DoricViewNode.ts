import { DoricContext } from "../DoricContext";
import { acquireViewNode } from "../DoricRegistry";

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

export function toRGBAString(color: number) {
    let strs = []
    for (let i = 0; i < 32; i += 8) {

        strs.push(((color >> i) & 0xff).toString(16))
    }
    strs = strs.map(e => {
        if (e.length === 1) {
            return '0' + e
        }
        return e
    }).reverse()
    /// RGBA
    return `#${strs[1]}${strs[2]}${strs[3]}${strs[0]}`
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
    }

    onBlended() {

    }

    configBorder() {
        if (this.border) {
            this.view.style.borderStyle = "solid"
            this.view.style.borderWidth = toPixelString(this.border.width)
            this.view.style.borderColor = toRGBAString(this.border.color)
        }
    }

    configWidth() {
        switch (this.layoutConfig.widthSpec) {
            case LayoutSpec.WRAP_CONTENT:
                this.view.style.width = "max-content"
                break

            case LayoutSpec.AT_MOST:
                this.view.style.width = "100%"
                break

            case LayoutSpec.EXACTLY:
            default:
                this.view.style.width = toPixelString(this.frameWidth
                    - this.paddingLeft - this.paddingRight
                    - this.borderWidth * 2)
                break
        }
    }
    configHeight() {
        switch (this.layoutConfig.heightSpec) {
            case LayoutSpec.WRAP_CONTENT:
                this.view.style.height = "max-content"
                break

            case LayoutSpec.AT_MOST:
                this.view.style.height = "100%"
                break

            case LayoutSpec.EXACTLY:
            default:
                this.view.style.height = toPixelString(this.frameHeight
                    - this.paddingTop - this.paddingBottom
                    - this.borderWidth * 2)
                break
        }
    }

    configMargin() {
        if (this.layoutConfig.margin) {
            this.view.style.marginLeft = toPixelString(this.layoutConfig.margin.left || 0)
            this.view.style.marginRight = toPixelString(this.layoutConfig.margin.right || 0)
            this.view.style.marginTop = toPixelString(this.layoutConfig.margin.top || 0)
            this.view.style.marginBottom = toPixelString(this.layoutConfig.margin.bottom || 0)
        }
    }

    configPadding() {
        if (this.padding) {
            this.view.style.paddingLeft = toPixelString(this.paddingLeft)
            this.view.style.paddingRight = toPixelString(this.paddingRight)
            this.view.style.paddingTop = toPixelString(this.paddingTop)
            this.view.style.paddingBottom = toPixelString(this.paddingBottom)
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
                this.backgroundColor = prop as number
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
                    this.view.style.borderTopLeftRadius = toPixelString(prop.leftTop)
                    this.view.style.borderTopRightRadius = toPixelString(prop.rightTop)
                    this.view.style.borderBottomRightRadius = toPixelString(prop.rightBottom)
                    this.view.style.borderBottomLeftRadius = toPixelString(prop.leftBottom)
                } else {
                    this.view.style.borderRadius = toPixelString(prop)
                }
                break
            case 'shadow':
                const opacity = prop.opacity || 0
                if (opacity > 0) {
                    const offsetX = prop.offsetX || 0
                    const offsetY = prop.offsetY || 0
                    const shadowColor = prop.color || 0xff000000
                    const shadowRadius = prop.radius
                    const alpha = opacity * 255
                    this.view.style.boxShadow = `${toPixelString(offsetX)} ${toPixelString(offsetY)} ${toPixelString(shadowRadius)} ${toRGBAString((shadowColor & 0xffffff) | ((alpha & 0xff) << 24))} `
                } else {
                    this.view.style.boxShadow = ""
                }
                break
            case 'alpha':
                this.view.style.opacity = `${prop}`
                break
        }
    }

    set backgroundColor(v: number) {
        this.view.style.backgroundColor = toRGBAString(v)
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

    setBackgroundColor(v: number) {
        this.backgroundColor = v
    }

    getAlpha() {
        return this.view.style.opacity
    }

    setAlpha(v: number) {
        this.view.style.opacity = `${v}`
    }

    getCorners() {
        return this.view.style.borderRadius
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