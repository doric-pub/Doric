@file:JsQualifier("doric")
@file:Suppress("INTERFACE_WITH_SUPERCLASS", "OVERRIDING_FINAL_MEMBER", "RETURN_TYPE_MISMATCH_ON_OVERRIDE", "CONFLICTING_OVERLOADS", "EXTERNAL_DELEGATION")
package doric

import kotlin.js.*
import kotlin.js.Json
import org.khronos.webgl.*
import org.w3c.dom.*
import org.w3c.dom.events.*
import org.w3c.dom.parsing.*
import org.w3c.dom.svg.*
import org.w3c.dom.url.*
import org.w3c.fetch.*
import org.w3c.files.*
import org.w3c.notifications.*
import org.w3c.performance.*
import org.w3c.workers.*
import org.w3c.xhr.*

external open class Color(v: Number) : Modeling {
    open var _value: Number
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

external interface GradientColor {
    var start: Color
    var end: Color
    var orientation: GradientOrientation
}