@file:JsQualifier("doric")
@file:Suppress("INTERFACE_WITH_SUPERCLASS", "OVERRIDING_FINAL_MEMBER", "RETURN_TYPE_MISMATCH_ON_OVERRIDE", "CONFLICTING_OVERLOADS", "EXTERNAL_DELEGATION")
package doric.native

import doric.BridgeContext
import kotlin.js.*

external interface `T$24` {
    var setItem: (key: String, value: String, zone: String?) -> Promise<Any>
    var getItem: (key: String, zone: String?) -> Promise<String>
    var remove: (key: String, zone: String?) -> Promise<Any>
    var clear: (zone: String) -> Promise<Any>
}

external fun storage(context: BridgeContext): `T$24`