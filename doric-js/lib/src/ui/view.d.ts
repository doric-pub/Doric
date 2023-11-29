import { BridgeContext } from "../runtime/global";
import { Color, GradientColor } from "../util/color";
import { FlexConfig } from "../util/flexbox";
import { LayoutConfig } from '../util/layoutconfig';
import { ClassType, Model, Modeling } from "../util/types";
import { IAnimation } from "./animation";
export declare function Property(target: Object, propKey: string): void;
export declare function InconsistProperty(target: Object, propKey: string): void;
export declare function ViewComponent(constructor: ClassType<any>): void;
export type NativeViewModel = {
    id: string;
    type: string;
    props: {
        [index: string]: Model;
    };
};
type RefType<T> = T extends Ref<infer R> ? R : never;
export declare class Ref<T extends View> {
    private view?;
    set current(v: T);
    get current(): T;
    apply(config: Partial<RefType<this>>): void;
}
export declare function createRef<T extends View>(): Ref<T>;
export declare abstract class View implements Modeling {
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
    /**
     * float [0,..1]
     */
    alpha?: number;
    hidden?: boolean;
    viewId: string;
    tag?: string;
    layoutConfig?: LayoutConfig;
    onClick?: Function;
    superview?: Superview;
    callbacks: Map<String, Function>;
    callback2Id(f: Function): string;
    private id2Callback;
    findViewByTag(tag: string): View | undefined;
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
    viewType(): any;
    onPropertyChanged(propKey: string, oldV: Model, newV: Model): void;
    needUpdate(): void;
    clean(): void;
    isDirty(): boolean;
    responseCallback(id: string, ...args: any): any;
    toModel(): NativeViewModel;
    let(block: (it: this) => void): void;
    also(block: (it: this) => void): this;
    apply(config: Partial<this>): this;
    into(group: Group): this;
    nativeChannel(context: BridgeContext, name: string): (args?: any) => Promise<any>;
    getWidth(context: BridgeContext): Promise<number>;
    getHeight(context: BridgeContext): Promise<number>;
    getX(context: BridgeContext): Promise<number>;
    getY(context: BridgeContext): Promise<number>;
    getLocationOnScreen(context: BridgeContext): Promise<{
        x: number;
        y: number;
    }>;
    /**++++++++++transform++++++++++*/
    translationX?: number;
    translationY?: number;
    /**
     * float [0,..1]
     */
    scaleX?: number;
    scaleY?: number;
    pivotX?: number;
    pivotY?: number;
    /**
     * rotation*PI
     * In Z
     */
    rotation?: number;
    /**
     * rotation*PI
     * In X
     */
    rotationX?: number;
    /**
     * rotation*PI
     * In Y
     */
    rotationY?: number;
    /**
     * Determines the distance between the z=0 plane and the user in order to give a 3D-positioned element some perspective.
     * Default is 200
     */
    perspective?: number;
    /**----------transform----------*/
    /**
     * Only affected when its superview or itself is FlexLayout.
     */
    flexConfig?: FlexConfig;
    /**
     * take effect on Android
     */
    transitionName?: string;
    set props(props: Partial<this>);
    set parent(v: Group);
    private _ref?;
    set ref(ref: Ref<this>);
    doAnimation(context: BridgeContext, animation: IAnimation): Promise<void>;
    clearAnimation(context: BridgeContext, animation: IAnimation): Promise<void>;
    cancelAnimation(context: BridgeContext, animation: IAnimation): Promise<void>;
    static isViewClass(): boolean;
}
export declare abstract class Superview extends View {
    subviewById(id: string): View | undefined;
    findViewByTag(tag: string): View | undefined;
    private findViewTraversal;
    abstract allSubviews(): Iterable<View>;
    isDirty(): boolean;
    clean(): void;
    toModel(): NativeViewModel;
}
export type ViewArray = View[];
export type ViewFragment = View | ViewArray | undefined | null;
export declare abstract class Group extends Superview implements JSX.ElementChildrenAttribute {
    padding?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
    readonly children: View[];
    allSubviews(): View[];
    addChild(view: View): void;
    removeChild(view: View): void;
    removeAllChildren(): void;
    private addInnerElement;
    set innerElement(e: View | ViewFragment | ViewFragment[] | undefined | null);
}
export {};
