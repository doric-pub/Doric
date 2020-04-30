@file:JsQualifier("doric")
@file:Suppress("INTERFACE_WITH_SUPERCLASS", "OVERRIDING_FINAL_MEMBER", "RETURN_TYPE_MISMATCH_ON_OVERRIDE", "CONFLICTING_OVERLOADS", "EXTERNAL_DELEGATION")
package doric.native

import doric.BridgeContext
import doric.ui.View
import kotlin.js.*

external interface `T$25` {
    var show: (view: View) -> Promise<Any>
    var dismiss: (view: View?) -> Promise<Any>
}

external fun popover(context: BridgeContext): `T$25`