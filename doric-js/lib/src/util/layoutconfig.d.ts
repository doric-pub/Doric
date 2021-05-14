import { Gravity } from "./gravity";
import { Modeling } from "./types";
export declare enum LayoutSpec {
    /**
     * Depends on what's been set on width or height.
    */
    JUST = 0,
    /**
     * Depends on it's content.
     */
    FIT = 1,
    /**
     * Extend as much as parent let it take.
     */
    MOST = 2
}
export interface LayoutConfig {
    widthSpec?: LayoutSpec;
    heightSpec?: LayoutSpec;
    margin?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
    alignment?: Gravity;
    weight?: number;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
}
export declare class LayoutConfigImpl implements LayoutConfig, Modeling {
    widthSpec?: LayoutSpec;
    heightSpec?: LayoutSpec;
    margin?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
    alignment?: Gravity;
    weight?: number;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    fit(): this;
    fitWidth(): this;
    fitHeight(): this;
    most(): this;
    mostWidth(): this;
    mostHeight(): this;
    just(): this;
    justWidth(): this;
    justHeight(): this;
    configWidth(w: LayoutSpec): this;
    configHeight(h: LayoutSpec): this;
    configMargin(m: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    }): this;
    configAlignment(a: Gravity): this;
    configWeight(w: number): this;
    configMaxWidth(v: number): this;
    configMaxHeight(v: number): this;
    configMinWidth(v: number): this;
    configMinHeight(v: number): this;
    toModel(): {
        widthSpec: LayoutSpec | undefined;
        heightSpec: LayoutSpec | undefined;
        margin: {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        } | undefined;
        alignment: number | undefined;
        weight: number | undefined;
    };
}
export declare function layoutConfig(): LayoutConfigImpl;
