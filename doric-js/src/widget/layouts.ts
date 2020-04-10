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
import { Group, Property, IView, View } from "../ui/view";
import { Gravity } from "../util/gravity";
import { layoutConfig } from "../util/layoutconfig";

export interface IStack extends IView {
}

export class Stack extends Group implements IStack {
}

export class Root extends Stack {

}
class LinearLayout extends Group {
    @Property
    space?: number

    @Property
    gravity?: Gravity
}

export interface IVLayout extends IView {
    space?: number
    gravity?: Gravity
}

export class VLayout extends LinearLayout implements IVLayout {
}


export interface IHLayout extends IView {
    space?: number
    gravity?: Gravity
}

export class HLayout extends LinearLayout implements IHLayout {
}

export function stack(views: View[], config?: IStack) {
    const ret = new Stack
    ret.layoutConfig = layoutConfig().fit()
    for (let v of views) {
        ret.addChild(v)
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret)
        }
    }
    return ret
}

export function hlayout(views: View[], config?: IHLayout) {
    const ret = new HLayout
    ret.layoutConfig = layoutConfig().fit()
    for (let v of views) {
        ret.addChild(v)
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret)
        }
    }
    return ret
}

export function vlayout(views: View[], config?: IVLayout) {
    const ret = new VLayout
    ret.layoutConfig = layoutConfig().fit()
    for (let v of views) {
        ret.addChild(v)
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret)
        }
    }
    return ret
}



export class FlexLayout extends Group {
}

export function flexlayout(views: View[], config: IView) {
    const ret = new FlexLayout
    ret.layoutConfig = layoutConfig().fit()
    for (let v of views) {
        ret.addChild(v)
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret)
        }
    }
    return ret
}