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
import { View, LayoutSpec } from './view'
import { Stack, HLayout, VLayout } from './layout'
import { IText, IImage, Text, Image } from './widgets'
import { IList, List } from './listview'

export function text(config: IText) {
    const ret = new Text
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}

export function image(config: IImage) {
    const ret = new Image
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}

export function stack(views: View[]) {
    const ret = new Stack
    ret.layoutConfig = {
        widthSpec: LayoutSpec.WRAP_CONTENT,
        heightSpec: LayoutSpec.WRAP_CONTENT,
    }
    for (let v of views) {
        ret.addChild(v)
    }
    return ret
}

export function hlayout(views: View[]) {
    const ret = new HLayout
    ret.layoutConfig = {
        widthSpec: LayoutSpec.WRAP_CONTENT,
        heightSpec: LayoutSpec.WRAP_CONTENT,
    }
    for (let v of views) {
        ret.addChild(v)
    }
    return ret
}

export function vlayout(views: View[]) {
    const ret = new VLayout
    ret.layoutConfig = {
        widthSpec: LayoutSpec.WRAP_CONTENT,
        heightSpec: LayoutSpec.WRAP_CONTENT,
    }
    for (let v of views) {
        ret.addChild(v)
    }
    return ret
}

export function list(config: IList) {
    const ret = new List
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}