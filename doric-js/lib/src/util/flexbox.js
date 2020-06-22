var ValueType;
(function (ValueType) {
    ValueType[ValueType["Undefined"] = 0] = "Undefined";
    ValueType[ValueType["Point"] = 1] = "Point";
    ValueType[ValueType["Percent"] = 2] = "Percent";
    ValueType[ValueType["Auto"] = 3] = "Auto";
})(ValueType || (ValueType = {}));
export class FlexTypedValue {
    constructor(type) {
        this.value = 0;
        this.type = type;
    }
    static percent(v) {
        const ret = new FlexTypedValue(ValueType.Percent);
        ret.value = v;
        return ret;
    }
    static point(v) {
        const ret = new FlexTypedValue(ValueType.Point);
        ret.value = v;
        return ret;
    }
    toModel() {
        return {
            type: this.type,
            value: this.value,
        };
    }
}
FlexTypedValue.Auto = new FlexTypedValue(ValueType.Auto);
export var FlexDirection;
(function (FlexDirection) {
    FlexDirection[FlexDirection["COLUMN"] = 0] = "COLUMN";
    FlexDirection[FlexDirection["COLUMN_REVERSE"] = 1] = "COLUMN_REVERSE";
    FlexDirection[FlexDirection["ROW"] = 2] = "ROW";
    FlexDirection[FlexDirection["ROW_REVERSE"] = 3] = "ROW_REVERSE";
})(FlexDirection || (FlexDirection = {}));
export var Align;
(function (Align) {
    Align[Align["AUTO"] = 0] = "AUTO";
    Align[Align["FLEX_START"] = 1] = "FLEX_START";
    Align[Align["CENTER"] = 2] = "CENTER";
    Align[Align["FLEX_END"] = 3] = "FLEX_END";
    Align[Align["STRETCH"] = 4] = "STRETCH";
    Align[Align["BASELINE"] = 5] = "BASELINE";
    Align[Align["SPACE_BETWEEN"] = 6] = "SPACE_BETWEEN";
    Align[Align["SPACE_AROUND"] = 7] = "SPACE_AROUND";
})(Align || (Align = {}));
export var Justify;
(function (Justify) {
    Justify[Justify["FLEX_START"] = 0] = "FLEX_START";
    Justify[Justify["CENTER"] = 1] = "CENTER";
    Justify[Justify["FLEX_END"] = 2] = "FLEX_END";
    Justify[Justify["SPACE_BETWEEN"] = 3] = "SPACE_BETWEEN";
    Justify[Justify["SPACE_AROUND"] = 4] = "SPACE_AROUND";
    Justify[Justify["SPACE_EVENLY"] = 5] = "SPACE_EVENLY";
})(Justify || (Justify = {}));
export var Direction;
(function (Direction) {
    Direction[Direction["INHERIT"] = 0] = "INHERIT";
    Direction[Direction["LTR"] = 1] = "LTR";
    Direction[Direction["RTL"] = 2] = "RTL";
})(Direction || (Direction = {}));
export var PositionType;
(function (PositionType) {
    PositionType[PositionType["RELATIVE"] = 0] = "RELATIVE";
    PositionType[PositionType["ABSOLUTE"] = 1] = "ABSOLUTE";
})(PositionType || (PositionType = {}));
export var Wrap;
(function (Wrap) {
    Wrap[Wrap["NO_WRAP"] = 0] = "NO_WRAP";
    Wrap[Wrap["WRAP"] = 1] = "WRAP";
    Wrap[Wrap["WRAP_REVERSE"] = 2] = "WRAP_REVERSE";
})(Wrap || (Wrap = {}));
export var OverFlow;
(function (OverFlow) {
    OverFlow[OverFlow["VISIBLE"] = 0] = "VISIBLE";
    OverFlow[OverFlow["HIDDEN"] = 1] = "HIDDEN";
    OverFlow[OverFlow["SCROLL"] = 2] = "SCROLL";
})(OverFlow || (OverFlow = {}));
export var Display;
(function (Display) {
    Display[Display["FLEX"] = 0] = "FLEX";
    Display[Display["NONE"] = 1] = "NONE";
})(Display || (Display = {}));
