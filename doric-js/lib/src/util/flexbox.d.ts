import { Modeling } from "./types";
declare enum ValueType {
    Undefined = 0,
    Point = 1,
    Percent = 2,
    Auto = 3
}
export declare class FlexTypedValue implements Modeling {
    type: ValueType;
    value: number;
    static Auto: FlexTypedValue;
    static percent(v: number): FlexTypedValue;
    static point(v: number): FlexTypedValue;
    toModel(): {
        type: ValueType;
        value: number;
    };
}
export declare enum FlexDirection {
    COLUMN = 0,
    COLUMN_REVERSE = 1,
    ROW = 2,
    ROW_REVERSE = 3
}
export declare enum Align {
    AUTO = 0,
    FLEX_START = 1,
    CENTER = 2,
    FLEX_END = 3,
    STRETCH = 4,
    BASELINE = 5,
    SPACE_BETWEEN = 6,
    SPACE_AROUND = 7
}
export declare enum Justify {
    FLEX_START = 0,
    CENTER = 1,
    FLEX_END = 2,
    SPACE_BETWEEN = 3,
    SPACE_AROUND = 4,
    SPACE_EVENLY = 5
}
export declare enum Direction {
    INHERIT = 0,
    LTR = 1,
    RTL = 2
}
export declare enum PositionType {
    RELATIVE = 0,
    ABSOLUTE = 1
}
export declare enum Wrap {
    NO_WRAP = 0,
    WRAP = 1,
    WRAP_REVERSE = 2
}
export declare enum OverFlow {
    VISIBLE = 0,
    HIDDEN = 1,
    SCROLL = 2
}
export declare enum Display {
    FLEX = 0,
    NONE = 1
}
export declare type FlexValue = FlexTypedValue | number;
export interface FlexConfig {
    direction?: Direction;
    flexDirection?: FlexDirection;
    justifyContent?: Justify;
    alignContent?: Align;
    alignItems?: Align;
    alignSelf?: Align;
    positionType?: PositionType;
    flexWrap?: Wrap;
    overFlow?: OverFlow;
    display?: Display;
    flex?: number;
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: FlexValue;
    marginLeft?: FlexValue;
    marginRight?: FlexValue;
    marginTop?: FlexValue;
    marginBottom?: FlexValue;
    marginStart?: FlexValue;
    marginEnd?: FlexValue;
    marginHorizontal?: FlexValue;
    marginVertical?: FlexValue;
    margin?: FlexValue;
    paddingLeft?: FlexValue;
    paddingRight?: FlexValue;
    paddingTop?: FlexValue;
    paddingBottom?: FlexValue;
    paddingStart?: FlexValue;
    paddingEnd?: FlexValue;
    paddingHorizontal?: FlexValue;
    paddingVertical?: FlexValue;
    padding?: FlexValue;
    borderLeftWidth?: number;
    borderRightWidth?: number;
    borderTopWidth?: number;
    borderBottomWidth?: number;
    borderStartWidth?: number;
    borderEndWidth?: number;
    borderWidth?: number;
    left?: FlexValue;
    right?: FlexValue;
    top?: FlexValue;
    bottom?: FlexValue;
    start?: FlexValue;
    end?: FlexValue;
    width?: FlexValue;
    height?: FlexValue;
    minWidth?: FlexValue;
    minHeight?: FlexValue;
    maxWidth?: FlexValue;
    maxHeight?: FlexValue;
    aspectRatio?: number;
}
export {};
