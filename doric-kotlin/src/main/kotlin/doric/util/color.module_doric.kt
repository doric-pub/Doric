@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.util

import kotlin.js.*

open external class Color(v: Number) : Modeling {
    open fun alpha(v: Number): Color
    override fun toModel(): Number

    companion object {
        var BLACK: Color
        var DKGRAY: Color
        var GRAY: Color
        var LTGRAY: Color
        var WHITE: Color
        var RED: Color
        var GREEN: Color
        var BLUE: Color
        var YELLOW: Color
        var CYAN: Color
        var MAGENTA: Color
        var TRANSPARENT: Color
        fun parse(str: String): Color
        fun safeParse(str: String, defVal: Color = definedExternally): Color
    }
}

external enum class GradientOrientation {
    TOP_BOTTOM /* = 0 */,
    TR_BL /* = 1 */,
    RIGHT_LEFT /* = 2 */,
    BR_TL /* = 3 */,
    BOTTOM_TOP /* = 4 */,
    BL_TR /* = 5 */,
    LEFT_RIGHT /* = 6 */,
    TL_BR /* = 7 */
}