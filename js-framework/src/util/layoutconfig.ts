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
import { Gravity } from "./gravity";
import { Modeling } from "./types";

export enum LayoutSpec {
    EXACTLY = 0,
    WRAP_CONTENT = 1,
    AT_MOST = 2,
}

export interface LayoutConfig {
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
