import { Modeling } from "./types";

/**
 *  Store color as format AARRGGBB or RRGGBB
 */
export class Color implements Modeling {

    static TRANSPARENT = new Color(0)
    _value: number = 0

    constructor(v: number) {
        this._value = v
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

