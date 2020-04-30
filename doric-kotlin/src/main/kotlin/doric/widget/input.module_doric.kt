@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.widget

import doric.BridgeContext
import doric.kotlin.Gravity
import doric.ui.View
import doric.util.Color
import kotlin.js.*


open external class Input : View {
    var multiline: Boolean?
    var text: String?
    var textColor: Color?
    var textSize: Number?
    var hintText: String?
    var hintTextColor: Color?
    var textAlignment: Gravity?
    var onTextChange: ((text: String) -> Unit)?
    var onFocusChange: ((focused: Boolean) -> Unit)?

    fun getText(context: BridgeContext): Promise<String>
    fun setSelection(context: BridgeContext, start: Number, end: Number = definedExternally): Promise<String>
    fun requestFocus(context: BridgeContext): Promise<Any>
    fun releaseFocus(context: BridgeContext): Promise<Any>
}