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
import { Property, View } from "../ui/view"
import { IStack, Stack } from "../widget/layouts"
import { layoutConfig } from "../util/layoutconfig"

export interface IDraggable extends IStack {
    onDrag?: (x: number, y: number) => void
}

export class Draggable extends Stack implements IDraggable {
    @Property
    onDrag?: (x: number, y: number) => void
}

export function draggable(views: View | View[], config?: IDraggable) {
    const ret = new Draggable
    ret.layoutConfig = layoutConfig().fit()
    if (views instanceof View) {
        ret.addChild(views)
    } else {
        views.forEach(e => {
            ret.addChild(e)
        })
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret)
        }
    }
    return ret
}