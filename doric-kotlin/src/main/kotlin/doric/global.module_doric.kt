@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric

import kotlin.js.Promise

external interface BridgeContext {
    var id: String
    var entity: Any
    fun callNative(namespace: String, method: String, args: Any = definedExternally): Promise<Any>
    fun function2Id(func: Function<*>): String
    fun removeFuncById(funcId: String)
}

external interface IEnvironment {
    val platform: String /* "Android" | "iOS" | "Qt" | "web" */
    val platformVersion: String
    val appName: String
    val appVersion: String
    val libVersion: String
    val screenWidth: Number
    val screenHeight: Number
    val screenScale: Number
    val statusBarHeight: Number
    val hasNotch: Boolean
    val deviceBrand: String
    val deviceModel: String
}

external val context: BridgeContext
external val Environment: IEnvironment
external fun Entry(constructor: Any): Any