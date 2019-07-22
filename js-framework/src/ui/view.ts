import { Color, GradientColor } from "../util/color"
import { Modeling, Model, obj2Model } from "../util/types";
import { uniqueId } from "../util/uniqueId";
import { loge } from "../util/log";

export function Property(target: Object, propKey: string) {
    Reflect.defineMetadata(propKey, true, target)
}

export abstract class View implements Modeling {
    @Property
    width: number = 0

    @Property
    height: number = 0

    @Property
    x: number = 0

    @Property
    y: number = 0

    @Property
    bgColor?: Color | GradientColor

    @Property
    corners?: number | { leftTop?: number; rightTop?: number; leftBottom?: number; rightBottom?: number }

    @Property
    border?: { width: number; color: Color; }

    @Property
    shadow?: { color: Color; opacity: number; radius: number; offset: { width: number; height: number; }; }

    @Property
    alpha?: number

    @Property
    hidden?: boolean

    @Property
    viewId = uniqueId('ViewId')

    parent?: Group

    callbacks: Map<String, Function> = new Map

    private callback2Id(f: Function) {
        const id = uniqueId('Function')
        this.callbacks.set(id, f)
        return id
    }

    private id2Callback(id: string) {
        const f = this.callbacks.get(id)
        return f
    }

    constructor() {
        return new Proxy(this, {
            get: (target, p) => {
                return Reflect.get(target, p)
            },
            set: (target, p, v) => {
                const oldV = Reflect.get(target, p)
                const ret = Reflect.set(target, p, v)
                if (Reflect.getMetadata(p, target)) {
                    this.onPropertyChanged(p.toString(), oldV, v)
                }
                return ret
            }
        })
    }
    /** Anchor start*/
    get left() {
        return this.x
    }
    set left(v: number) {
        this.x = v
    }

    get right() {
        return this.x + this.width
    }
    set right(v: number) {
        this.x = v - this.width
    }

    get top() {
        return this.y
    }

    set top(v: number) {
        this.y = v
    }

    get bottom() {
        return this.y + this.height
    }

    set bottom(v: number) {
        this.y = v - this.height
    }
    /** Anchor end*/

    __dirty_props__: { [index: string]: Model | undefined } = {}

    onPropertyChanged(propKey: string, oldV: Model, newV: Model): void {
        if (newV instanceof Function) {
            newV = this.callback2Id(newV)
        } else {
            newV = obj2Model(newV)
        }
        this.__dirty_props__[propKey] = newV
        if (this.parent instanceof Group) {
            this.parent.onChildPropertyChanged(this, propKey, oldV, newV)
        }
    }

    clean() {
        for (const key in this.__dirty_props__) {
            if (this.__dirty_props__.hasOwnProperty(key)) {
                this.__dirty_props__[key] = undefined
            }
        }
    }
    isDirty() {
        return Reflect.ownKeys(this.__dirty_props__).length === 0
    }
    responseCallback(id: string, ...args: any) {
        const f = this.id2Callback(id)
        if (f instanceof Function) {
            const argumentsList: any = []
            for (let i = 1; i < arguments.length; i++) {
                argumentsList.push(arguments[i])
            }
            Reflect.apply(f, this, argumentsList)
        } else {
            loge(`Cannot find callback:${id} for ${JSON.stringify(this.toModel())}`)
        }
    }
    toModel() {
        return {
            id: this.viewId,
            type: this.constructor.name,
            props: this.__dirty_props__,
        }
    }

    @Property
    padding?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }

    @Property
    config?: Config
}

export enum Alignment {
    center = 0,
    start,
    end,
}

export enum Gravity {
    center = 0,
    left,
    right,
    top,
    bottom,
}

export interface Config {
    margin?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }
    alignment?: Alignment
}

export interface StackConfig extends Config {

}

export interface LayoutConfig extends Config {
    weight?: number
}

export abstract class Group extends View {

    @Property
    children: View[] = new Proxy([], {
        set: (target, index, value) => {
            if (typeof index === 'number' && value instanceof View) {
                value.parent = this
                const childrenModel = this.getDirtyChildrenModel()
                childrenModel[index] = value.toModel()
            } else if (index === 'length') {
                this.getDirtyChildrenModel().length = value as number
            }
            return Reflect.set(target, index, value)
        }
    })

    clean() {
        this.children.forEach(e => { e.clean() })
        super.clean()
    }

    getDirtyChildrenModel(): Model[] {
        if (this.__dirty_props__.children === undefined) {
            this.__dirty_props__.children = []
        }
        return this.__dirty_props__.children as Model[]
    }

    toModel() {
        if (this.__dirty_props__.children != undefined) {
            (this.__dirty_props__.children as Model[]).length = this.children.length
        }
        return super.toModel()
    }

    onChildPropertyChanged(child: View, propKey: string, oldV: Model, newV: Model) {

    }
}

export class Stack extends Group {
    @Property
    gravity?: number
}

class LinearLayout extends Group {
    @Property
    space?: number

    @Property
    gravity?: number
}

export class VLayout extends LinearLayout {
}

export class HLayout extends LinearLayout {
}

export class Text extends View {
    @Property
    text?: string

    @Property
    textColor?: Color

    @Property
    textSize?: number

    @Property
    maxLines?: number
}

export class Image extends View {
    @Property
    imageUrl?: string
}

export class List extends View {

}

export class Slide extends View {

}
