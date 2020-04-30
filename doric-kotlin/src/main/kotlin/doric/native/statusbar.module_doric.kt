@file:JsQualifier("doric")
@file:Suppress("INTERFACE_WITH_SUPERCLASS", "OVERRIDING_FINAL_MEMBER", "RETURN_TYPE_MISMATCH_ON_OVERRIDE", "CONFLICTING_OVERLOADS", "EXTERNAL_DELEGATION")
package doric.native

import doric.BridgeContext
import doric.util.Color
import kotlin.js.*

external enum class StatusBarMode {
    LIGHT /* = 0 */,
    DARK /* = 1 */
}

external interface `T$30` {
    var setHidden: (hidden: Boolean) -> Promise<Any>
    var setMode: (mode: StatusBarMode) -> Promise<Any>
    var setColor: (color: Color) -> Promise<Any>
}

external fun statusbar(context: BridgeContext): `T$30`