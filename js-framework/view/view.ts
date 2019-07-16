import { Color, GradientColor } from "../util/color"
import { Property, IWatcher } from "../util/types";


export abstract class View implements IWatcher {

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

    onPropertyChanged(propKey: string, oldV: any, newV: any): void {
        console.log(`onPropertyChanged:${propKey},old value is ${oldV},new value is ${newV}`)
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
