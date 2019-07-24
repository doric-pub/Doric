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