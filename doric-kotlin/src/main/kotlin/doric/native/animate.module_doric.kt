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
import kotlin.js.Promise

external interface AnimateArgument {
    var animations: () -> Unit
    var duration: Number
}

external fun animate(context: BridgeContext): (args: AnimateArgument) -> Promise<Any>