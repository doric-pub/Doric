/**
 *  Store color as format AARRGGBB or RRGGBB
 */
let Color = /** @class */ (() => {
    class Color {
        constructor(v) {
            this._value = 0;
            this._value = v | 0x0;
        }
        static parse(str) {
            if (!str.startsWith("#")) {
                throw new Error(`Parse color error with ${str}`);
            }
            const val = parseInt(str.substr(1), 16);
            if (str.length === 7) {
                return new Color(val | 0xff000000);
            }
            else if (str.length === 9) {
                return new Color(val);
            }
            else {
                throw new Error(`Parse color error with ${str}`);
            }
        }
        static safeParse(str, defVal = Color.TRANSPARENT) {
            let color = defVal;
            try {
                color = Color.parse(str);
            }
            catch (e) {
            }
            finally {
                return color;
            }
        }
        alpha(v) {
            v = v * 255;
            return new Color((this._value & 0xffffff) | ((v & 0xff) << 24));
        }
        toModel() {
            return this._value;
        }
    }
    Color.BLACK = new Color(0xFF000000);
    Color.DKGRAY = new Color(0xFF444444);
    Color.GRAY = new Color(0xFF888888);
    Color.LTGRAY = new Color(0xFFCCCCCC);
    Color.WHITE = new Color(0xFFFFFFFF);
    Color.RED = new Color(0xFFFF0000);
    Color.GREEN = new Color(0xFF00FF00);
    Color.BLUE = new Color(0xFF0000FF);
    Color.YELLOW = new Color(0xFFFFFF00);
    Color.CYAN = new Color(0xFF00FFFF);
    Color.MAGENTA = new Color(0xFFFF00FF);
    Color.TRANSPARENT = new Color(0);
    return Color;
})();
export { Color };
export var GradientOrientation;
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
})(GradientOrientation || (GradientOrientation = {}));
