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

external interface `T$20` {
    var alias: String?
        get() = definedExternally
        set(value) = definedExternally
    var animated: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var extra: Any?
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$21` {
    var push: (source: String, config: dynamic /* `T$20` | Nothing? */) -> Promise<Any>
    var pop: (animated: Boolean) -> Promise<Any>
    var openUrl: (url: String) -> Promise<Any>
}

external fun navigator(context: BridgeContext): `T$21`