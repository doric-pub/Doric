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
import { View, Property } from "../ui/view"
import { Color, GradientColor } from "../util/color"
import { Gravity } from "../util/gravity"
import { layoutConfig } from "../util/layoutconfig"
import { Resource } from "../util/resource"

export enum TruncateAt {
    End = 0,
    Middle = 1,
    Start = 2,
    Clip = 3,
}

export class Text extends View implements JSX.ElementChildrenAttribute {
    @Property
    text?: string

    @Property
    textColor?: Color | GradientColor

    @Property
    textSize?: number

    @Property
    maxLines?: number

    @Property
    textAlignment?: Gravity

    @Property
    fontStyle?: "normal" | "bold" | "italic" | "bold_italic"

    @Property
    font?: string | Resource

    @Property
    maxWidth?: number

    @Property
    maxHeight?: number

    @Property
    lineSpacing?: number

    @Property
    strikethrough?: boolean

    @Property
    underline?: boolean

    @Property
    htmlText?: string

    @Property
    truncateAt?: TruncateAt

    @Property
    padding?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }

    set innerElement(e: string) {
        this.text = e
    }
}

export function text(config: Partial<Text>) {
    const ret = new Text
    ret.layoutConfig = layoutConfig().fit()
    ret.apply(config)
    return ret
}