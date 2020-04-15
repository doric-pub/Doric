@file:JsQualifier("doric")
@file:Suppress("INTERFACE_WITH_SUPERCLASS", "OVERRIDING_FINAL_MEMBER", "RETURN_TYPE_MISMATCH_ON_OVERRIDE", "CONFLICTING_OVERLOADS", "EXTERNAL_DELEGATION")
package doric

import kotlin.js.*
import kotlin.js.Json
import org.khronos.webgl.*
import org.w3c.dom.*
import org.w3c.dom.events.*
import org.w3c.dom.parsing.*
import org.w3c.dom.svg.*
import org.w3c.dom.url.*
import org.w3c.fetch.*
import org.w3c.files.*
import org.w3c.notifications.*
import org.w3c.performance.*
import org.w3c.workers.*
import org.w3c.xhr.*

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