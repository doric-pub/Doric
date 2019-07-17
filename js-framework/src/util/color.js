"use strict";
exports.__esModule = true;
/**
 *  Store color as format AARRGGBB or RRGGBB
 */
var Color = /** @class */ (function () {
    function Color(v) {
        this._value = 0;
        this._value = v;
    }
    Color.parse = function (str) {
        if (!str.startsWith("#")) {
            throw new Error("Parse color error with " + str);
        }
        var val = parseInt(str.substr(1), 16);
        if (str.length === 7) {
            return new Color(val | 0xff000000);
        }
        else if (str.length === 9) {
            return new Color(val);
        }
        else {
            throw new Error("Parse color error with " + str);
        }
    };
    Color.safeParse = function (str, defVal) {
        if (defVal === void 0) { defVal = Color.TRANSPARENT; }
        var color = defVal;
        try {
            color = Color.parse(str);
        }
        catch (e) {
        }
        finally {
            return color;
        }
    };
    Color.prototype.toModel = function () {
        return this._value;
    };
    Color.TRANSPARENT = new Color(0);
    return Color;
}());
exports.Color = Color;
var GradientOrientation;
(function (GradientOrientation) {
    /** draw the gradient from the top to the bottom */
    GradientOrientation[GradientOrientation["TOP_BOTTOM"] = 0] = "TOP_BOTTOM";
    /** draw the gradient from the top-right to the bottom-left */
    GradientOrientation[GradientOrientation["TR_BL"] = 1] = "TR_BL";
    /** draw the gradient from the right to the left */
    GradientOrientation[GradientOrientation["RIGHT_LEFT"] = 2] = "RIGHT_LEFT";
    /** draw the gradient from the bottom-right to the top-left */
    GradientOrientation[GradientOrientation["BR_TL"] = 3] = "BR_TL";
    /** draw the gradient from the bottom to the top */
    GradientOrientation[GradientOrientation["BOTTOM_TOP"] = 4] = "BOTTOM_TOP";
    /** draw the gradient from the bottom-left to the top-right */
    GradientOrientation[GradientOrientation["BL_TR"] = 5] = "BL_TR";
    /** draw the gradient from the left to the right */
    GradientOrientation[GradientOrientation["LEFT_RIGHT"] = 6] = "LEFT_RIGHT";
    /** draw the gradient from the top-left to the bottom-right */
    GradientOrientation[GradientOrientation["TL_BR"] = 7] = "TL_BR";
})(GradientOrientation = exports.GradientOrientation || (exports.GradientOrientation = {}));
