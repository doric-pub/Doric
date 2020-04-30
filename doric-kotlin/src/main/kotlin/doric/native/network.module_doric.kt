@file:JsQualifier("doric")
@file:Suppress("INTERFACE_WITH_SUPERCLASS", "OVERRIDING_FINAL_MEMBER", "RETURN_TYPE_MISMATCH_ON_OVERRIDE", "CONFLICTING_OVERLOADS", "EXTERNAL_DELEGATION")
package doric.native

import doric.BridgeContext
import kotlin.js.*

external interface `T$22` {
    @nativeGetter
    operator fun get(index: String): String?
    @nativeSetter
    operator fun set(index: String, value: String)
}

external interface IRequest {
    var url: String?
        get() = definedExternally
        set(value) = definedExternally
    var method: String /* "get" | "post" | "put" | "delete" */
    var headers: `T$22`?
        get() = definedExternally
        set(value) = definedExternally
    var params: `T$22`?
        get() = definedExternally
        set(value) = definedExternally
    var data: dynamic /* Any? | String */
        get() = definedExternally
        set(value) = definedExternally
    var timeout: Number?
        get() = definedExternally
        set(value) = definedExternally
}

external interface IResponse {
    var data: Any
    var status: Number
    var headers: `T$22`?
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$23` {
    var request: (config: IRequest) -> Promise<IResponse>
    var get: (url: String, config: IRequest?) -> Promise<IResponse>
    var post: (url: String, data: dynamic /* String | Any? | Nothing? */, config: IRequest?) -> Promise<IResponse>
    var put: (url: String, data: dynamic /* String | Any? | Nothing? */, config: IRequest?) -> Promise<IResponse>
    var delete: (url: String, data: dynamic /* String | Any? | Nothing? */, config: IRequest?) -> Promise<IResponse>
}

external fun network(context: BridgeContext): `T$23`