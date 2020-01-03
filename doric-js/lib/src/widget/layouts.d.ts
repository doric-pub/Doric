import { Group, IView, View } from "../ui/view";
import { Gravity } from "../util/gravity";
export interface IStack extends IView {
}
export declare class Stack extends Group implements IStack {
}
export declare class Root extends Stack {
}
declare class LinearLayout extends Group {
    space?: number;
    gravity?: Gravity;
}
export interface IVLayout extends IView {
    space?: number;
    gravity?: Gravity;
}
export declare class VLayout extends LinearLayout implements VLayout {
}
export interface IHLayout extends IView {
    space?: number;
    gravity?: Gravity;
}
export declare class HLayout extends LinearLayout implements IHLayout {
}
export declare function stack(views: View[]): Stack;
export declare function hlayout(views: View[]): HLayout;
export declare function vlayout(views: View[]): VLayout;
export {};
