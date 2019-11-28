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
import { IView, View, Property } from "../ui/view"
import { layoutConfig } from "../util/layoutconfig"

export enum ScaleType {
    ScaleToFill = 0,
    ScaleAspectFit,
    ScaleAspectFill,
}

export interface IImage extends IView {
    imageUrl?: string
    imageBase64?: string
    scaleType?: ScaleType
    loadCallback?: (image: { width: number; height: number } | undefined) => void
}

export class Image extends View implements IImage {
    @Property
    imageUrl?: string
    @Property
    imageBase64?: string
    @Property
    scaleType?: ScaleType

    @Property
    loadCallback?: (image: { width: number; height: number } | undefined) => void
}

export function image(config: IImage) {
    const ret = new Image
    ret.layoutConfig = layoutConfig().wrap()
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}