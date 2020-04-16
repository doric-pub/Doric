import { Group, View } from "../ui/view";
import { Gravity } from "../util/gravity";
export declare class Stack extends Group {
}
export declare class Root extends Stack {
}
declare class LinearLayout extends Group {
    space?: number;
    gravity?: Gravity;
}
export declare class VLayout extends LinearLayout {
}
export declare class HLayout extends LinearLayout {
}
export declare function stack(views: View[], config?: Partial<Stack>): Stack;
export declare function hlayout(views: View[], config?: Partial<HLayout>): HLayout;
export declare function vlayout(views: View[], config?: Partial<VLayout>): VLayout;
export declare class FlexLayout extends Group {
}
export declare function flexlayout(views: View[], config?: Partial<FlexLayout>): FlexLayout;
export {};
