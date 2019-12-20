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
function toPixelString(v: number) {
    return `${v}px`
}

function toRGBAString(color: number) {
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
    superNode?: DoricSuperViewNode
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

    init(superNode: DoricSuperViewNode) {
        this.superNode = superNode
        if (this instanceof DoricSuperViewNode) {
            this.reusable = superNode.reusable
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
        for (let key in props) {
            this.blendProps(this.view, key, props[key])
        }
        if (this.border) {
            this.view.style.borderStyle = "solid"
            this.view.style.borderWidth = toPixelString(this.border.width)
            this.view.style.borderColor = toRGBAString(this.border.color)
        }
        if (this.padding) {
            this.view.style.paddingLeft = toPixelString(this.paddingLeft)
            this.view.style.paddingRight = toPixelString(this.paddingRight)
            this.view.style.paddingTop = toPixelString(this.paddingTop)
            this.view.style.paddingBottom = toPixelString(this.paddingBottom)
        }
        this.x = this.offsetX
        this.y = this.offsetY
    }

    layout() {
        this.layoutSelf({ width: this.frameWidth, height: this.frameHeight })
    }

    layoutSelf(targetSize: FrameSize) {
        this.width = targetSize.width
        this.height = targetSize.height
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
        }
    }

    set width(v: number) {
        this.view.style.width = toPixelString(v - this.paddingLeft - this.paddingRight - this.borderWidth * 2)
    }
    get width() {
        return this.view.offsetWidth
    }
    set height(v: number) {
        this.view.style.height = toPixelString(v - this.paddingTop - this.paddingBottom - this.borderWidth * 2)
    }
    get height() {
        return this.view.offsetHeight
    }
    set x(v: number) {
        this.view.style.left = toPixelString(v + (this.superNode?.paddingLeft || 0))
    }
    get x() {
        return this.view.offsetLeft
    }
    set y(v: number) {
        this.view.style.top = toPixelString(v + (this.superNode?.paddingTop || 0))
    }

    get y() {
        return this.view.offsetTop
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

    abstract measureContentSize(targetSize: FrameSize): FrameSize
}


export abstract class DoricSuperViewNode extends DoricViewNode {
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

    abstract getSubNodeById(viewId: string): DoricViewNode
}

export abstract class DoricGroupViewNode extends DoricSuperViewNode {
    childNodes: DoricViewNode[] = []
    childViewIds: string[] = []

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
        this.configChildNode()
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