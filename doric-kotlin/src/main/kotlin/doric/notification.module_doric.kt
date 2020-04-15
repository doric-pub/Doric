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

external interface `T$27` {
    var biz: String?
        get() = definedExternally
        set(value) = definedExternally
    var name: String
    var data: Any?
        get() = definedExternally
        set(value) = definedExternally
    var androidSystem: Boolean?
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$28` {
    var biz: String?
        get() = definedExternally
        set(value) = definedExternally
    var name: String
    var callback: (data: Any) -> Unit
    var androidSystem: Boolean?
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$29` {
    var publish: (args: `T$27`) -> Promise<Any>
    var subscribe: (args: `T$28`) -> Promise<String>
    var unsubscribe: (subscribeId: String) -> Promise<Any>
}

external fun notification(context: BridgeContext): `T$29`