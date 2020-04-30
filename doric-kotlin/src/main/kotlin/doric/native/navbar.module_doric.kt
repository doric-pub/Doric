@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.native

import doric.BridgeContext
import doric.ui.View
import doric.util.Color
import kotlin.js.*

external interface `T$19` {
    var isHidden: () -> Promise<Boolean>
    var setHidden: (hidden: Boolean) -> Promise<Any>
    var setTitle: (title: String) -> Promise<Any>
    var setBgColor: (color: Color) -> Promise<Any>
    var setLeft: (view: View) -> Promise<Any>
    var setRight: (view: View) -> Promise<Any>
}

external fun navbar(context: BridgeContext): `T$19`