@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

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

external interface `T$31` {
    var start: Number
    var end: Number
}

external interface `T$32` {
    var name: String /* "width" | "height" | "x" | "y" | "backgroundColor" | "alpha" */
    var start: dynamic /* Number | Color */
        get() = definedExternally
        set(value) = definedExternally
    var end: dynamic /* Number | Color */
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$33` {
    var scrollable: dynamic /* List | Scroller | FlowLayout */
        get() = definedExternally
        set(value) = definedExternally
    var scrollRange: `T$31`
    var target: dynamic /* View | "NavBar" */
        get() = definedExternally
        set(value) = definedExternally
    var changing: `T$32`
}

external interface `T$34` {
    var verticalScrolling: (argument: `T$33`) -> Unit
}

external fun coordinator(context: BridgeContext): `T$34`