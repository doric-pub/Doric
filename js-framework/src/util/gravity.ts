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

const SPECIFIED = 1
const START = 1 << 1
const END = 1 << 2

const SHIFT_X = 0
const SHIFT_Y = 4

export const LEFT = (START | SPECIFIED) << SHIFT_X
export const RIGHT = (END | SPECIFIED) << SHIFT_X

export const TOP = (START | SPECIFIED) << SHIFT_Y
export const BOTTOM = (END | SPECIFIED) << SHIFT_Y

export const CENTER_X = SPECIFIED << SHIFT_X
export const CENTER_Y = SPECIFIED << SHIFT_Y

export const CENTER = CENTER_X | CENTER_Y

export class Gravity implements Modeling {
    val = 0

    left() {
        const val = this.val | LEFT
        const ret = new Gravity
        ret.val = val
        return ret
    }

    right() {
        const val = this.val | RIGHT
        const ret = new Gravity
        ret.val = val
        return ret
    }

    top() {
        const val = this.val | TOP
        const ret = new Gravity
        ret.val = val
        return ret
    }

    bottom() {
        const val = this.val | BOTTOM
        const ret = new Gravity
        ret.val = val
        return ret
    }

    center() {
        const val = this.val | CENTER
        const ret = new Gravity
        ret.val = val
        return ret
    }

    centerX() {
        const val = this.val | CENTER_X
        const ret = new Gravity
        ret.val = val
        return ret
    }

    centerY() {
        const val = this.val | CENTER_Y
        const ret = new Gravity
        ret.val = val
        return ret
    }


    toModel() {
        return this.val
    }
    private static origin = new Gravity

    static Center = Gravity.origin.center()
    static Left = Gravity.origin.left()
    static Right = Gravity.origin.right()
    static Top = Gravity.origin.top()
    static Bottom = Gravity.origin.bottom()
}
export function gravity() {
    return new Gravity
}