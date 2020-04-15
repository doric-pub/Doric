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

external var LEFT: Number

external var RIGHT: Number

external var TOP: Number

external var BOTTOM: Number

external var CENTER_X: Number

external var CENTER_Y: Number

external var CENTER: Number

external open class Gravity : Modeling {
    open var `val`: Number
    open fun left(): Gravity
    open fun right(): Gravity
    open fun top(): Gravity
    open fun bottom(): Gravity
    open fun center(): Gravity
    open fun centerX(): Gravity
    open fun centerY(): Gravity
    override fun toModel(): Number

    companion object {
        var origin: Any
        var Center: Gravity
        var CenterX: Gravity
        var CenterY: Gravity
        var Left: Gravity
        var Right: Gravity
        var Top: Gravity
        var Bottom: Gravity
    }
}

external fun gravity(): Gravity