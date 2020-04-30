@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.util

import kotlin.js.*

external interface Modeling {
    fun toModel(): dynamic /* String | Number | Boolean | Modeling | `T$7` | Nothing? | Array<dynamic /* String | Number | Boolean | Modeling | `T$7` | Nothing? */> */
}