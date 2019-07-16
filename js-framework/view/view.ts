import { Color, GradientColor } from "../util/color"
import { Property, IWatcher, Modeling, Model } from "../util/types";


export abstract class View implements IWatcher, Modeling {
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

    __dirty_props__?: { [index: string]: Model | undefined }

    onPropertyChanged(propKey: string, oldV: Model, newV: Model): void {
        //console.log(`onPropertyChanged:${propKey},old value is ${oldV},new value is ${newV}`)
        if (this.__dirty_props__ === undefined) {
            this.__dirty_props__ = {}
        }
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
}

export class Group extends View {
    children: View[] = []

    add(v: View) {
        this.children.push(v)
    }
}

export class Text extends View {

}

export class Image extends View {

}

export class List extends View {

}

export class Slide extends View {

}
