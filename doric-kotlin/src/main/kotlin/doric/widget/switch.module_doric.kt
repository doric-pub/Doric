@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.widget

import doric.ui.View
import doric.util.Color
import kotlin.js.*

open external class Switch : View {
    var state: Boolean?
    var onSwitch: (state: Boolean) -> Unit?
    var offTintColor: Color?
    var onTintColor: Color?
    var thumbTintColor: Color?
}
