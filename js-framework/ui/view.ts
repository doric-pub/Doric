import { Color, GradientColor } from "../util/color"
import { Modeling, Model } from "../util/types";
import "reflect-metadata"

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
        if (newV instanceof Object
            && Reflect.has(newV, 'toModel')
            && Reflect.get(newV, 'toModel') instanceof Function) {
            newV = Reflect.apply(Reflect.get(newV, 'toModel'), newV, [])
        }
        this.__dirty_props__[propKey] = newV
    }

    toModel() {
        return this.__dirty_props__ || {}
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
    children: View[] = []
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
