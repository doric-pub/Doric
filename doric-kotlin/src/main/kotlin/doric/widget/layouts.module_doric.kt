@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.widget

import doric.kotlin.Gravity
import doric.ui.Group
import kotlin.js.*


open external class Stack : Group

open external class Root : Stack

open external class LinearLayout : Group {
    open var space: Number?
    open var gravity: Gravity?
}

open external class VLayout : LinearLayout {
}

open external class HLayout : LinearLayout {
}

open external class FlexLayout : Group
