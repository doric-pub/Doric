import { IView, Group } from "../ui/view";
import { Modeling } from "../util/types";
declare enum ValueType {
    Point = 0,
    Percent = 1,
    Auto = 2
}
export declare class FlexValue implements Modeling {
    type: ValueType;
    value: number;
    static Auto: FlexValue;
    static percent(v: number): FlexValue;
    static point(v: number): FlexValue;
    toModel(): {
        type: ValueType;
        value: number;
    };
}
export interface IFlex extends IView {
}
export declare class FlexLayout extends Group implements IFlex {
}
export {};
