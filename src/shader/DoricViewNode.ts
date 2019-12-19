import { DoricContext } from "../DoricContext";
import { acquireViewNode } from "../DoricRegistry";

enum LayoutSpec {
    EXACTLY = 0,
    WRAP_CONTENT = 1,
    AT_MOST = 2,
}

function parse(str: string) {
    if (!str.startsWith("#")) {
        throw new Error(`Parse color error with ${str}`);
    }
    const val = parseInt(str.substr(1), 16);
    if (str.length === 7) {
        return (val | 0xff000000);
    }
    else if (str.length === 9) {
        return (val);
    }
    else {
        throw new Error(`Parse color error with ${str}`);
    }
}
function safeParse(str: string, defVal = 0) {
    let color = defVal;
    try {
        color = parse(str);
    }
    catch (e) {
    }
    finally {
        return color;
    }
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

    blend(props: { [index: string]: any }) {
        for (let key in props) {
            this.blendProps(this.view, key, props[key])
        }
    }

    blendProps(v: HTMLElement, propName: string, prop: any) {
        switch (propName) {
            case 'width':
                this.width = prop as number
                break
            case 'height':
                this.height = prop as number
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
        }
    }

    set width(v: number) {
        this.view.style.width = `${v}px`
    }

    get width() {
        const ret = this.view.style.width.match(/([0-9]*)px/)
        if (ret && ret.length > 1) {
            return parseInt(ret[1])
        }
        return 0
    }

    set height(v: number) {
        this.view.style.width = `${v}px`
    }

    get height() {
        const ret = this.view.style.height.match(/([0-9]*)px/)
        if (ret && ret.length > 1) {
            return parseInt(ret[1])
        }
        return 0
    }

    set backgroundColor(v: number) {
        let strs = []
        for (let i = 0; i < 32; i += 8) {

            strs.push(((v >> i) & 0xff).toString(16))
        }
        strs = strs.map(e => {
            if (e.length === 1) {
                return '0' + e
            }
            return e
        }).reverse()
        /// RGBA
        this.view.style.backgroundColor = `#${strs[1]}${strs[2]}${strs[3]}${strs[0]}`
    }

    get backgroundColor() {
        return safeParse(this.view.style.backgroundColor)
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
        this.childNodes.filter(e => e.viewId === model.id).forEach(e => {
            e.blend(model.props)
        })
    }

    getSubNodeById(viewId: string) {
        return this.childNodes.filter(e => e.viewId === viewId)[0]
    }

}