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
import { View, LayoutSpec, LayoutConfig } from './view'
import { Stack, HLayout, VLayout } from './layout'
import { IText, IImage, Text, Image } from './widgets'
import { IList, List } from './list'
import { ISlider, Slider } from './slider'
import { Gravity } from '../util/gravity'
import { Modeling } from '../util/types'

export function text(config: IText) {
    const ret = new Text
    ret.layoutConfig = layoutConfig().wrap()
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}

export function image(config: IImage) {
    const ret = new Image
    ret.layoutConfig = layoutConfig().wrap()
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}

export function stack(views: View[]) {
    const ret = new Stack
    ret.layoutConfig = layoutConfig().wrap()
    for (let v of views) {
        ret.addChild(v)
    }
    return ret
}

export function hlayout(views: View[]) {
    const ret = new HLayout
    ret.layoutConfig = layoutConfig().wrap()
    for (let v of views) {
        ret.addChild(v)
    }
    return ret
}

export function vlayout(views: View[]) {
    const ret = new VLayout
    ret.layoutConfig = layoutConfig().wrap()
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

export function slider(config: ISlider) {
    const ret = new Slider
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}

export class LayoutConfigImpl implements LayoutConfig, Modeling {
    widthSpec?: LayoutSpec
    heightSpec?: LayoutSpec
    margin?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }
    alignment?: Gravity
    //Only affective in VLayout or HLayout
    weight?: number

    wrap() {
        this.widthSpec = LayoutSpec.WRAP_CONTENT
        this.heightSpec = LayoutSpec.WRAP_CONTENT
        return this
    }

    atmost() {
        this.widthSpec = LayoutSpec.AT_MOST
        this.heightSpec = LayoutSpec.AT_MOST
        return this
    }

    exactly() {
        this.widthSpec = LayoutSpec.EXACTLY
        this.heightSpec = LayoutSpec.EXACTLY
        return this
    }

    w(w: LayoutSpec) {
        this.widthSpec = w
        return this
    }

    h(h: LayoutSpec) {
        this.heightSpec = h
        return this
    }

    m(m: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }) {
        this.margin = m
        return this
    }

    a(a: Gravity) {
        this.alignment = a
        return this
    }

    wg(w: number) {
        this.weight = w
        return this
    }

    toModel() {
        return {
            widthSpec: this.widthSpec,
            heightSpec: this.heightSpec,
            margin: this.margin,
            alignment: this.alignment ? this.alignment.toModel() : undefined,
            weight: this.weight,
        }
    }
}

export function layoutConfig() {
    return new LayoutConfigImpl
}