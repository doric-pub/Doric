@file:JsQualifier("doric")
@file:Suppress("INTERFACE_WITH_SUPERCLASS", "OVERRIDING_FINAL_MEMBER", "RETURN_TYPE_MISMATCH_ON_OVERRIDE", "CONFLICTING_OVERLOADS", "EXTERNAL_DELEGATION")
package doric.native

import doric.BridgeContext
import kotlin.js.*

external interface `T$35` {
    var top: Number
    var left: Number
    var bottom: Number
    var right: Number
}

external interface `T$36` {
    var inset: () -> Promise<`T$35`>
}

external fun notch(context: BridgeContext): `T$36`