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
    JUST = 0,
    FIT = 1,
    MOST = 2,
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

    fit() {
        this.widthSpec = LayoutSpec.FIT
        this.heightSpec = LayoutSpec.FIT
        return this
    }

    most() {
        this.widthSpec = LayoutSpec.MOST
        this.heightSpec = LayoutSpec.MOST
        return this
    }

    just() {
        this.widthSpec = LayoutSpec.JUST
        this.heightSpec = LayoutSpec.JUST
        return this
    }

    configWidth(w: LayoutSpec) {
        this.widthSpec = w
        return this
    }

    configHeight(h: LayoutSpec) {
        this.heightSpec = h
        return this
    }

    configMargin(m: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }) {
        this.margin = m
        return this
    }

    configAligmnet(a: Gravity) {
        this.alignment = a
        return this
    }

    configWeight(w: number) {
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
