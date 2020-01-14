import { Modeling } from "./types";
export declare const LEFT: number;
export declare const RIGHT: number;
export declare const TOP: number;
export declare const BOTTOM: number;
export declare const CENTER_X: number;
export declare const CENTER_Y: number;
export declare const CENTER: number;
export declare class Gravity implements Modeling {
    val: number;
    left(): Gravity;
    right(): Gravity;
    top(): Gravity;
    bottom(): Gravity;
    center(): Gravity;
    centerX(): Gravity;
    centerY(): Gravity;
    toModel(): number;
    private static origin;
    static Center: Gravity;
    static CenterX: Gravity;
    static CenterY: Gravity;
    static Left: Gravity;
    static Right: Gravity;
    static Top: Gravity;
    static Bottom: Gravity;
}
export declare function gravity(): Gravity;
