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
import { Modeling } from "./types";

enum ValueType {
    Point = 0,
    Percent = 1,
    Auto = 2,
}

export class FlexValue implements Modeling {

    type = ValueType.Auto
    value = 0

    static Auto = new FlexValue

    static percent(v: number) {
        const ret = new FlexValue
        ret.type = ValueType.Percent
        ret.value = v
        return ret
    }

    static point(v: number) {
        const ret = new FlexValue
        ret.type = ValueType.Point
        ret.value = v
        return ret
    }

    toModel() {
        return {
            type: this.type,
            value: this.value,
        }
    }
}

export enum FlexDirection {
    COLUMN = 0,
    COLUMN_REVERSE = 1,
    ROW = 2,
    ROW_REVERSE = 3,
}

export enum Align {
    AUTO = 0,
    FLEX_START = 1,
    CENTER = 2,
    FLEX_END = 3,
    STRETCH = 4,
    BASELINE = 5,
    SPACE_BETWEEN = 6,
    SPACE_AROUND = 7,
}

export enum Justify {
    FLEX_START = 0,
    CENTER = 1,
    FLEX_END = 2,
    SPACE_BETWEEN = 3,
    SPACE_AROUND = 4,
    SPACE_EVENLY = 5,
}

export enum Direction {
    INHERIT = 0,
    LTR = 1,
    RTL = 2,
}

export enum PositionType {
    RELATIVE = 0,
    ABSOLUTE = 1,
}
export enum Wrap {
    NO_WRAP = 0,
    WRAP = 1,
    WRAP_REVERSE = 2,
}
export enum OverFlow {
    VISIBLE = 0,
    HIDDEN = 1,
    SCROLL = 2,
}

export enum Display {
    FLEX = 0,
    NONE = 1,
}

export interface FlexConfig {
    direction?: Direction
    flexDirection?: FlexDirection
    justifyContent?: Justify
    alignContent?: Align
    alignItems?: Align
    alignSelf?: Align
    positionType?: PositionType
    flexWrap?: Wrap
    overFlow?: OverFlow
    display?: Display
    flex?: number
    flexGrow?: number
    flexShrink?: number
    flexBasis?: FlexValue

    marginLeft?: FlexValue
    marginRight?: FlexValue
    marginTop?: FlexValue
    marginBottom?: FlexValue
    marginStart?: FlexValue
    marginEnd?: FlexValue
    marginHorizontal?: FlexValue
    marginVertical?: FlexValue
    margin?: FlexValue

    paddingLeft?: FlexValue
    paddingRight?: FlexValue
    paddingTop?: FlexValue
    paddingBottom?: FlexValue
    paddingStart?: FlexValue
    paddingEnd?: FlexValue
    paddingHorizontal?: FlexValue
    paddingVertical?: FlexValue
    padding?: FlexValue


    borderWidthLeft?: FlexValue
    borderWidthRight?: FlexValue
    borderWidthTop?: FlexValue
    borderWidthBottom?: FlexValue
    borderWidthStart?: FlexValue
    borderWidthEnd?: FlexValue
    borderWidth?: FlexValue

    left?: FlexValue
    right?: FlexValue
    top?: FlexValue
    bottom?: FlexValue
    start?: FlexValue
    end?: FlexValue

    width?: FlexValue
    height?: FlexValue

    minWidth?: FlexValue
    minHeight?: FlexValue

    maxWidth?: FlexValue
    maxHeight?: FlexValue

    aspectRatio?: number
}