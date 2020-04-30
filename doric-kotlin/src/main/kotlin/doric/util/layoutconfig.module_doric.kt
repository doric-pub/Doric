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

external enum class LayoutSpec {
    JUST /* = 0 */,
    FIT /* = 1 */,
    MOST /* = 2 */
}