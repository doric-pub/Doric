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

external interface ISwitch : IView {
    var state: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var onSwitch: ((state: Boolean) -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
    var onTintColor: Color?
        get() = definedExternally
        set(value) = definedExternally
    var offTintColor: Color?
        get() = definedExternally
        set(value) = definedExternally
    var thumbTintColor: Color?
        get() = definedExternally
        set(value) = definedExternally
}

external open class Switch : View {
    open var state: Boolean
    open var onSwitch: (state: Boolean) -> Unit
    open var offTintColor: Color
    open var onTintColor: Color
    open var thumbTintColor: Color
}

external fun switchView(config: ISwitch): Switch