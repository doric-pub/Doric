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
import { loge } from "../util/log";
import { BridgeContext } from "../runtime/global";
import { LayoutConfig } from '../util/layoutconfig'
import { IAnimation } from "./animation";
import { FlexConfig } from "../util/flexbox";

export function Property(target: View, propKey: string) {
    Object.defineProperty(target, propKey, {
        get: function () {
            return Reflect.get(this, `__prop__${propKey}`, this)
        },
        set: function (v) {
            const oldV = Reflect.get(this, `__prop__${propKey}`, this)
            Reflect.set(this, `__prop__${propKey}`, v, this)
            if (oldV !== v) {
                Reflect.apply(this.onPropertyChanged, this, [propKey, oldV, v])
            }
        },
    })
}

export function InconsistProperty(target: Object, propKey: string) {
    Object.defineProperty(target, propKey, {
        get: function () {
            return Reflect.get(this, `__prop__${propKey}`, this)
        },
        set: function (v) {
            const oldV = Reflect.get(this, `__prop__${propKey}`, this)
            Reflect.set(this, `__prop__${propKey}`, v, this)
            Reflect.apply(this.onPropertyChanged, this, [propKey, oldV, v])
        },
    })
}

export type NativeViewModel = {
    id: string;
    type: string;
    props: {
        [index: string]: Model;
    };
}

export abstract class View implements Modeling {
    private __dirty_props__!: { [index: string]: Model | undefined }

    @Property
    width: number = 0

    @Property
    height: number = 0

    @Property
    x: number = 0

    @Property
    y: number = 0

    @Property
    backgroundColor?: Color | GradientColor

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

    viewId = uniqueId('ViewId')

    @Property
    padding?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }

    @Property
    layoutConfig?: LayoutConfig

    @Property
    onClick?: Function

    superview?: Superview

    callbacks!: Map<String, Function>
    private callback2Id(f: Function) {
        if (this.callbacks === undefined) {
            this.callbacks = new Map
        }
        const id = uniqueId('Function')
        this.callbacks.set(id, f)
        return id
    }

    private id2Callback(id: string) {
        if (this.callbacks === undefined) {
            this.callbacks = new Map
        }
        let f = this.callbacks.get(id)
        if (f === undefined) {
            f = Reflect.get(this, id) as Function
        }
        return f
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


    get dirtyProps() {
        return this.__dirty_props__
    }

    nativeViewModel: NativeViewModel = {
        id: this.viewId,
        type: this.viewType(),
        props: this.__dirty_props__,
    }

    viewType() {
        return this.constructor.name
    }

    onPropertyChanged(propKey: string, oldV: Model, newV: Model): void {
        if (newV instanceof Function) {
            newV = this.callback2Id(newV)
        } else {
            newV = obj2Model(newV, (v) => this.callback2Id(v))
        }
        if (this.__dirty_props__ === undefined) {
            this.__dirty_props__ = {}
        }
        this.__dirty_props__[propKey] = newV
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
            return Reflect.apply(f, this, argumentsList)
        } else {
            loge(`Cannot find callback:${id} for ${JSON.stringify(this.toModel())}`)
        }
    }

    toModel() {
        return this.nativeViewModel
    }

    let(block: (it: this) => void) {
        block(this)
    }

    also(block: (it: this) => void) {
        block(this)
        return this
    }

    apply(config: Partial<this>) {
        for (let key in config) {
            Reflect.set(this, key, Reflect.get(config, key, config), this)
        }
        return this
    }

    in(group: Group) {
        group.addChild(this)
        return this
    }

    nativeChannel(context: BridgeContext, name: string) {
        let thisView: View | undefined = this
        return function (args: any = undefined) {
            const viewIds = []
            while (thisView != undefined) {
                viewIds.push(thisView.viewId)
                thisView = thisView.superview
            }
            const params = {
                viewIds: viewIds.reverse(),
                name,
                args,
            }

            return context.callNative('shader', 'command', params) as Promise<any>
        }
    }

    getWidth(context: BridgeContext) {
        return this.nativeChannel(context, 'getWidth')() as Promise<number>
    }

    getHeight(context: BridgeContext) {
        return this.nativeChannel(context, 'getHeight')() as Promise<number>
    }

    getX(context: BridgeContext) {
        return this.nativeChannel(context, 'getX')() as Promise<number>
    }

    getY(context: BridgeContext) {
        return this.nativeChannel(context, 'getY')() as Promise<number>
    }

    getLocationOnScreen(context: BridgeContext) {
        return this.nativeChannel(context, "getLocationOnScreen")() as Promise<{ x: number, y: number }>
    }

    /**++++++++++transform++++++++++*/
    @Property
    translationX?: number

    @Property
    translationY?: number

    @Property
    scaleX?: number

    @Property
    scaleY?: number

    @Property
    pivotX?: number

    @Property
    pivotY?: number

    @Property
    rotation?: number

    /**
     * rotation*PI
     * In X
     */
    @Property
    rotationX?: number
    /**
     * rotation*PI
     * In Y
     */
    @Property
    rotationY?: number

    /**
     * Determines the distance between the z=0 plane and the user in order to give a 3D-positioned element some perspective.
     */
    @Property
    perspective?: number
    /**----------transform----------*/

    @Property
    flexConfig?: FlexConfig

    doAnimation(context: BridgeContext, animation: IAnimation) {
        return this.nativeChannel(context, "doAnimation")(animation.toModel()).then((args) => {
            for (let key in args) {
                Reflect.set(this, key, Reflect.get(args, key, args), this)
                Reflect.deleteProperty(this.__dirty_props__, key)
            }
        })
    }

    clearAnimation(context: BridgeContext, animation: IAnimation) {
        return this.nativeChannel(context, "clearAnimation")(animation.id).then(() => {
            this.__dirty_props__.translationX = this.translationX || 0
            this.__dirty_props__.translationY = this.translationY || 0
            this.__dirty_props__.scaleX = this.scaleX || 1
            this.__dirty_props__.scaleY = this.scaleY || 1
            this.__dirty_props__.rotation = this.rotation || 0
        })
    }

    cancelAnimation(context: BridgeContext, animation: IAnimation) {
        return this.nativeChannel(context, "cancelAnimation")(animation.id).then((args) => {
            for (let key in args) {
                Reflect.set(this, key, Reflect.get(args, key, args), this)
                Reflect.deleteProperty(this.__dirty_props__, key)
            }
        })
    }
}

export abstract class Superview extends View {
    subviewById(id: string): View | undefined {
        for (let v of this.allSubviews()) {
            if (v.viewId === id) {
                return v
            }
        }
    }
    abstract allSubviews(): Iterable<View>

    isDirty() {
        if (super.isDirty()) {
            return true
        } else {
            for (const v of this.allSubviews()) {
                if (v.isDirty()) {
                    return true
                }
            }
        }
        return false
    }

    clean() {
        for (let v of this.allSubviews()) {
            v.clean()
        }
        super.clean()
    }

    toModel() {
        const subviews = []
        for (let v of this.allSubviews()) {
            if (v != undefined) {
                v.superview = this
                if (v.isDirty()) {
                    subviews.push(v.toModel())
                }
            }
        }
        this.dirtyProps.subviews = subviews
        return super.toModel()
    }
}

export abstract class Group extends Superview {

    readonly children: View[] = []

    allSubviews() {
        return this.children
    }

    addChild(view: View) {
        this.children.push(view)
        this.dirtyProps.children = this.children.map(e => e.viewId)
    }
}

