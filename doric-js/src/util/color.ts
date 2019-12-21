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

/**
 *  Store color as format AARRGGBB or RRGGBB
 */
export class Color implements Modeling {
    static BLACK = new Color(0xFF000000)
    static DKGRAY = new Color(0xFF444444)
    static GRAY = new Color(0xFF888888)
    static LTGRAY = new Color(0xFFCCCCCC)
    static WHITE = new Color(0xFFFFFFFF)
    static RED = new Color(0xFFFF0000)
    static GREEN = new Color(0xFF00FF00)
    static BLUE = new Color(0xFF0000FF)
    static YELLOW = new Color(0xFFFFFF00)
    static CYAN = new Color(0xFF00FFFF)
    static MAGENTA = new Color(0xFFFF00FF)
    static TRANSPARENT = new Color(0)

    _value: number = 0

    constructor(v: number) {
        this._value = v | 0x0
    }

    static parse(str: string) {
        if (!str.startsWith("#")) {
            throw new Error(`Parse color error with ${str}`)
        }
        const val = parseInt(str.substr(1), 16)
        if (str.length === 7) {
            return new Color(val | 0xff000000)
        } else if (str.length === 9) {
            return new Color(val)
        } else {
            throw new Error(`Parse color error with ${str}`)
        }
    }

    static safeParse(str: string, defVal: Color = Color.TRANSPARENT) {
        let color = defVal
        try {
            color = Color.parse(str)
        } catch (e) {
        } finally {
            return color
        }
    }

    alpha(v: number) {
        return new Color((this._value & 0xffffff) | ((v & 0xff) << 24))
    }

    toModel() {
        return this._value
    }
}
export enum GradientOrientation {
    /** draw the gradient from the top to the bottom */
    TOP_BOTTOM = 0,
    /** draw the gradient from the top-right to the bottom-left */
    TR_BL,
    /** draw the gradient from the right to the left */
    RIGHT_LEFT,
    /** draw the gradient from the bottom-right to the top-left */
    BR_TL,
    /** draw the gradient from the bottom to the top */
    BOTTOM_TOP,
    /** draw the gradient from the bottom-left to the top-right */
    BL_TR,
    /** draw the gradient from the left to the right */
    LEFT_RIGHT,
    /** draw the gradient from the top-left to the bottom-right */
    TL_BR,
}

export interface GradientColor {
    start: Color
    end: Color
    orientation: GradientOrientation
}

