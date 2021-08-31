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
import { Group, Property, View } from "../ui/view";
import { Gravity } from "../util/gravity";
import { layoutConfig } from "../util/layoutconfig";

export class Stack extends Group {
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

export function stack(views: View[], config?: Partial<Stack>) {
    const ret = new Stack
    ret.layoutConfig = layoutConfig().fit()
    for (let v of views) {
        ret.addChild(v)
    }
    if (config) {
        ret.apply(config)
    }
    return ret
}

export function hlayout(views: View[], config?: Partial<HLayout>) {
    const ret = new HLayout
    ret.layoutConfig = layoutConfig().fit()
    for (let v of views) {
        ret.addChild(v)
    }
    if (config) {
        ret.apply(config)
    }
    return ret
}

export function vlayout(views: View[], config?: Partial<VLayout>) {
    const ret = new VLayout
    ret.layoutConfig = layoutConfig().fit()
    for (let v of views) {
        ret.addChild(v)
    }
    if (config) {
        ret.apply(config)
    }
    return ret
}



export class FlexLayout extends Group {
}

export function flexlayout(views: View[], config?: Partial<FlexLayout>) {
    const ret = new FlexLayout
    ret.layoutConfig = layoutConfig().fit()
    for (let v of views) {
        ret.addChild(v)
    }
    if (config) {
        ret.apply(config)
    }
    return ret
}