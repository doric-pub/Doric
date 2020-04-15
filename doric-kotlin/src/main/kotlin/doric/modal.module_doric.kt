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

external interface `T$15` {
    var title: String
    var msg: String
    var okLabel: String?
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$16` {
    var title: String
    var msg: String
    var okLabel: String?
        get() = definedExternally
        set(value) = definedExternally
    var cancelLabel: String?
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$17` {
    var title: String?
        get() = definedExternally
        set(value) = definedExternally
    var msg: String?
        get() = definedExternally
        set(value) = definedExternally
    var okLabel: String?
        get() = definedExternally
        set(value) = definedExternally
    var cancelLabel: String?
        get() = definedExternally
        set(value) = definedExternally
    var text: String?
        get() = definedExternally
        set(value) = definedExternally
    var defaultText: String?
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$18` {
    var toast: (msg: String, gravity: Gravity) -> Unit
    var alert: (arg: dynamic /* String | `T$15` */) -> Promise<Any>
    var confirm: (arg: dynamic /* String | `T$16` */) -> Promise<Any>
    var prompt: (arg: `T$17`) -> Promise<String>
}

external fun modal(context: BridgeContext): `T$18`