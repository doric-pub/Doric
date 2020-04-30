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
import kotlin.js.*

external interface `T$34` {
    var verticalScrolling: (argument: dynamic) -> Unit
}

external fun coordinator(context: BridgeContext): `T$34`