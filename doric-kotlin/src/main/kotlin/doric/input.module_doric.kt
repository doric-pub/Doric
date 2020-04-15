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

external interface IInput : IView {
    var text: String?
        get() = definedExternally
        set(value) = definedExternally
    var textColor: Color?
        get() = definedExternally
        set(value) = definedExternally
    var textSize: Number?
        get() = definedExternally
        set(value) = definedExternally
    var hintText: String?
        get() = definedExternally
        set(value) = definedExternally
    var hintTextColor: Color?
        get() = definedExternally
        set(value) = definedExternally
    var multilines: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var textAlignment: Gravity?
        get() = definedExternally
        set(value) = definedExternally
    var onTextChange: ((text: String) -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
    var onFocusChange: ((focused: Boolean) -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
}

external open class Input : View, IInput {
    open var multiline: Boolean
    open fun getText(context: BridgeContext): Promise<String>
    open fun setSelection(context: BridgeContext, start: Number, end: Number = definedExternally): Promise<String>
    open fun requestFocus(context: BridgeContext): Promise<Any>
    open fun releaseFocus(context: BridgeContext): Promise<Any>
}

external fun input(config: IInput): Input