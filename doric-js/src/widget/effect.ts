/*
 * Copyright [2021] [Doric.Pub]
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
import { Stack } from "../widget/layouts"
import { Property, View } from "../ui/view"
import { layoutConfig } from "../util/layoutconfig"

export class BlurEffect extends Stack {
    /**
     * Specify the effective rectangle.
     * If not set, the default is the entire area.
     */
    @Property
    effectiveRect?: {
        x: number,
        y: number,
        width: number,
        height: number,
    }
    /**
     * Specify the radius of blur effect.
     * If not set, the default value is 15.
     * Suggested value is from 1 to 25.
     */
    @Property
    radius?: number
}


export class AeroEffect extends Stack {
    /**
     * Specify the effective rectangle.
     * If not set, the default is the entire area.
     */
    @Property
    effectiveRect?: {
        x: number,
        y: number,
        width: number,
        height: number,
    }
    /**
     * Specify the area of the view is lighter or darker than the underlying view.
     * If not set, the default is light.
     */
    @Property
    style?: "light" | "dark" | "extraLight"
}


export function blurEffect(views: View | View[], config?: Partial<BlurEffect>) {
    const ret = new BlurEffect
    ret.layoutConfig = layoutConfig().fit()
    if (views instanceof View) {
        ret.addChild(views)
    } else {
        views.forEach(e => {
            ret.addChild(e)
        })
    }
    if (config) {
        ret.apply(config)
    }
    return ret
}

export function aeroEffect(views: View | View[], config?: Partial<AeroEffect>) {
    const ret = new AeroEffect
    ret.layoutConfig = layoutConfig().fit()
    if (views instanceof View) {
        ret.addChild(views)
    } else {
        views.forEach(e => {
            ret.addChild(e)
        })
    }
    if (config) {
        ret.apply(config)
    }
    return ret
}