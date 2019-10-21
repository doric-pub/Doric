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
        this.val |= LEFT
        return this
    }

    right() {
        this.val |= RIGHT
        return this
    }

    top() {
        this.val |= TOP
        return this
    }

    bottom() {
        this.val |= BOTTOM
        return this
    }

    center() {
        this.val |= CENTER
        return this
    }

    centerX() {
        this.val |= CENTER_X
        return this
    }

    centerY() {
        this.val |= CENTER_Y
        return this
    }


    toModel() {
        return this.val
    }

}