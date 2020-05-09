import { Modeling } from "./types";
/**
 *  Store color as format AARRGGBB or RRGGBB
 */
export declare class Color implements Modeling {
    static BLACK: Color;
    static DKGRAY: Color;
    static GRAY: Color;
    static LTGRAY: Color;
    static WHITE: Color;
    static RED: Color;
    static GREEN: Color;
    static BLUE: Color;
    static YELLOW: Color;
    static CYAN: Color;
    static MAGENTA: Color;
    static TRANSPARENT: Color;
    _value: number;
    constructor(v: number);
    static parse(str: string): Color;
    static safeParse(str: string, defVal?: Color): Color;
    alpha(v: number): Color;
    toModel(): number;
}
export declare enum GradientOrientation {
    /** draw the gradient from the top to the bottom */
    TOP_BOTTOM = 0,
    /** draw the gradient from the top-right to the bottom-left */
    TR_BL = 1,
    /** draw the gradient from the right to the left */
    RIGHT_LEFT = 2,
    /** draw the gradient from the bottom-right to the top-left */
    BR_TL = 3,
    /** draw the gradient from the bottom to the top */
    BOTTOM_TOP = 4,
    /** draw the gradient from the bottom-left to the top-right */
    BL_TR = 5,
    /** draw the gradient from the left to the right */
    LEFT_RIGHT = 6,
    /** draw the gradient from the top-left to the bottom-right */
    TL_BR = 7
}
export interface GradientColor {
    start?: Color;
    end?: Color;
    colors?: Array<Color>;
    locations?: Array<Number>;
    orientation: GradientOrientation;
}
