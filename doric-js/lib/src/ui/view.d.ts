import { Color, GradientColor } from "../util/color";
import { Modeling, Model } from "../util/types";
import { BridgeContext } from "../runtime/global";
import { LayoutConfig } from '../util/layoutconfig';
import { IAnimation } from "./animation";
export declare function Property(target: Object, propKey: string): void;
export interface IView {
    width?: number;
    height?: number;
    backgroundColor?: Color | GradientColor;
    corners?: number | {
        leftTop?: number;
        rightTop?: number;
        leftBottom?: number;
        rightBottom?: number;
    };
    border?: {
        width: number;
        color: Color;
    };
    shadow?: {
        color: Color;
        opacity: number;
        radius: number;
        offsetX: number;
        offsetY: number;
    };
    /**
     * float [0,..1]
     */
    alpha?: number;
    hidden?: boolean;
    padding?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
    layoutConfig?: LayoutConfig;
    onClick?: Function;
    identifier?: string;
    /**++++++++++transform++++++++++*/
    translationX?: number;
    translationY?: number;
    scaleX?: number;
    scaleY?: number;
    /**
     * float [0,..1]
     */
    pivotX?: number;
    /**
     * float [0,..1]
     */
    pivotY?: number;
    /**
     * rotation*PI
     */
    rotation?: number;
}
export declare type NativeViewModel = {
    id: string;
    type: string;
    props: {
        [index: string]: Model;
    };
};
export declare abstract class View implements Modeling, IView {
    width: number;
    height: number;
    x: number;
    y: number;
    backgroundColor?: Color | GradientColor;
    corners?: number | {
        leftTop?: number;
        rightTop?: number;
        leftBottom?: number;
        rightBottom?: number;
    };
    border?: {
        width: number;
        color: Color;
    };
    shadow?: {
        color: Color;
        opacity: number;
        radius: number;
        offsetX: number;
        offsetY: number;
    };
    alpha?: number;
    hidden?: boolean;
    viewId: string;
    padding?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
    layoutConfig?: LayoutConfig;
    onClick?: Function;
    superview?: Superview;
    callbacks: Map<String, Function>;
    private callback2Id;
    private id2Callback;
    constructor();
    /** Anchor start*/
    get left(): number;
    set left(v: number);
    get right(): number;
    set right(v: number);
    get top(): number;
    set top(v: number);
    get bottom(): number;
    set bottom(v: number);
    get centerX(): number;
    get centerY(): number;
    set centerX(v: number);
    set centerY(v: number);
    /** Anchor end*/
    private __dirty_props__;
    get dirtyProps(): {
        [index: string]: Model;
    };
    nativeViewModel: NativeViewModel;
    onPropertyChanged(propKey: string, oldV: Model, newV: Model): void;
    clean(): void;
    isDirty(): boolean;
    responseCallback(id: string, ...args: any): any;
    toModel(): NativeViewModel;
    let(block: (it: this) => void): void;
    also(block: (it: this) => void): this;
    apply(config: IView): this;
    in(group: Group): this;
    nativeChannel(context: BridgeContext, name: string): (args?: any) => Promise<any>;
    getWidth(context: BridgeContext): Promise<number>;
    getHeight(context: BridgeContext): Promise<number>;
    getLocationOnScreen(context: BridgeContext): Promise<{
        x: number;
        y: number;
    }>;
    /**++++++++++transform++++++++++*/
    translationX?: number;
    translationY?: number;
    scaleX?: number;
    scaleY?: number;
    pivotX?: number;
    pivotY?: number;
    rotation?: number;
    /**----------transform----------*/
    doAnimation(context: BridgeContext, animation: IAnimation): Promise<void>;
}
export declare abstract class Superview extends View {
    subviewById(id: string): View | undefined;
    abstract allSubviews(): Iterable<View>;
    isDirty(): boolean;
    clean(): void;
    toModel(): NativeViewModel;
}
export declare abstract class Group extends Superview {
    readonly children: View[];
    allSubviews(): View[];
    addChild(view: View): void;
}
