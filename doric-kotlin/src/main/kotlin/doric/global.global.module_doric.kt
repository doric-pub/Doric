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

external var context: BridgeContext

external object Environment {
    var platform: String /* "Android" | "iOS" | "Qt" | "web" */
    var platformVersion: String
    var appName: String
    var appVersion: String
    var libVersion: String
    var screenWidth: Number
    var screenHeight: Number
    var statusBarHeight: Number
    var hasNotch: Boolean
    var deviceBrand: String
    var deviceModel: String

    @nativeGetter
    operator fun get(index: String): dynamic /* Number | String | Boolean | Any? | Nothing? */

    @nativeSetter
    operator fun set(index: String, value: dynamic /* Number | String | Boolean | Any? | Nothing? */)
}

external fun Entry(constructor: Any): Any