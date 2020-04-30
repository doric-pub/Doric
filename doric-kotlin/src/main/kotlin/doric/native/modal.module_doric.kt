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
import doric.kotlin.Gravity
import kotlin.js.*

external interface `T$18` {
    var toast: (msg: String, gravity: Gravity) -> Unit
    var alert: (arg: dynamic /* String | `T$15` */) -> Promise<Any>
    var confirm: (arg: dynamic /* String | `T$16` */) -> Promise<Any>
    var prompt: (arg: dynamic) -> Promise<String>
}

external fun modal(context: BridgeContext): `T$18`