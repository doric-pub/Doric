/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Color, GradientColor } from "../util/color"
import { Modeling, Model, obj2Model } from "../util/types";
import { uniqueId } from "../util/uniqueId";
import { Gravity } from "../util/gravity";
import { loge } from "../util/log";

export const MATCH_PARENT = -1

export const WRAP_CONTENT = -2

export function Property(target: Object, propKey: string) {
    Reflect.defineMetadata(propKey, true, target)
}

export abstract class View implements Modeling {
    @Property
    width: number = WRAP_CONTENT

    @Property
    height: number = WRAP_CONTENT

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
    shadow?: { color: Color; opacity: number; radius: number; offsetX: number; offsetY: number }

    @Property
    alpha?: number

    @Property
    hidden?: boolean

    @Property
    viewId = uniqueId('ViewId')

    @Property
    padding?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }

    @Property
    layoutConfig?: Config

    @Property
    onClick?: Function

    /**
     * Set to reuse native view
     */
    @Property
    identifier?: string

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
            get: (target, p, receiver) => {
                return Reflect.get(target, p, receiver)
            },
            set: (target, p, v, receiver) => {
                const oldV = Reflect.get(target, p, receiver)
                const ret = Reflect.set(target, p, v, receiver)
                if (Reflect.getMetadata(p, target) && oldV !== v) {
                    receiver.onPropertyChanged(p.toString(), oldV, v)
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

    get centerX() {
        return this.x + this.width / 2
    }

    get centerY() {
        return this.y + this.height / 2
    }

    set centerX(v: number) {
        this.x = v - this.width / 2
    }

    set centerY(v: number) {
        this.y = v - this.height / 2
    }
    /** Anchor end*/

    __dirty_props__: { [index: string]: Model | undefined } = {}

    nativeViewModel = {
        id: this.viewId,
        type: this.constructor.name,
        props: this.__dirty_props__,
    }

    onPropertyChanged(propKey: string, oldV: Model, newV: Model): void {
        if (newV instanceof Function) {
            newV = this.callback2Id(newV)
        } else {
            newV = obj2Model(newV)
        }
        this.__dirty_props__[propKey] = newV
        if (this.parent instanceof Group) {
            this.parent.onChildPropertyChanged(this)
        }
    }

    clean() {
        for (const key in this.__dirty_props__) {
            if (Reflect.has(this.__dirty_props__, key)) {
                Reflect.deleteProperty(this.__dirty_props__, key)
            }
        }
    }

    isDirty() {
        return Reflect.ownKeys(this.__dirty_props__).length !== 0
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
        return this.nativeViewModel
    }

}

export interface Config {
    margin?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }
    alignment?: Gravity
}

export interface StackConfig extends Config {

}

export interface LinearConfig extends Config {
    weight?: number
}

export abstract class Group extends View {

    @Property
    readonly children: View[] = new Proxy([], {
        set: (target, index, value) => {
            if (index === 'length') {
                this.getDirtyChildrenModel().length = value as number
            } else if (typeof index === 'string'
                && parseInt(index) >= 0
                && value instanceof View) {
                value.parent = this
                const childrenModel = this.getDirtyChildrenModel()
                childrenModel[parseInt(index)] = value.nativeViewModel
            }
            if (this.parent) {
                this.parent.onChildPropertyChanged(this)
            }

            return Reflect.set(target, index, value)
        }
    })

    addChild(view: View) {
        this.children.push(view)
    }

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

    onChildPropertyChanged(child: View) {
        this.getDirtyChildrenModel()[this.children.indexOf(child)] = child.nativeViewModel
        this.getDirtyChildrenModel().length = this.children.length
        if (this.parent) {
            this.parent.onChildPropertyChanged(this)
        }
    }

    isDirty() {
        return super.isDirty()
    }
}

export class Stack extends Group {
    @Property
    gravity?: Gravity
}
export class Root extends Stack {

}
class LinearLayout extends Group {
    @Property
    space?: number

    @Property
    gravity?: Gravity
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

    @Property
    textAlignment?: Gravity
}

export class Image extends View {
    @Property
    imageUrl?: string
}

export class List extends View {
    @Property
    itemCount = 0

    @Property
    renderItem?: (index: number) => View
}

export class SectionList extends View {
    @Property
    sectionRowsCount: number[] = []

    @Property
    renderSectionHeader?: (section: number) => View

    @Property
    renderItem?: (item: number, section: number) => View

    @Property
    sectionHeaderSticky = true
}

export class Slide extends View {

}

export function stack() {

}

export function vlayout(providers: Array<() => View>, config: {
    width: number
    height: number
    space?: number
}) {
    const vlayout = new VLayout
    vlayout.width = config.width
    vlayout.height = config.height
    if (config.space !== undefined) {
        vlayout.space = config.space
    }
    providers.forEach(e => {
        vlayout.addChild(e())
    })
    return vlayout
}
