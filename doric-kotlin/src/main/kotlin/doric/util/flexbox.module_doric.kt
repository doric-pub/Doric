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

external enum class ValueType {
    Undefined /* = 0 */,
    Point /* = 1 */,
    Percent /* = 2 */,
    Auto /* = 3 */
}

external enum class FlexDirection {
    COLUMN /* = 0 */,
    COLUMN_REVERSE /* = 1 */,
    ROW /* = 2 */,
    ROW_REVERSE /* = 3 */
}

external enum class Align {
    AUTO /* = 0 */,
    FLEX_START /* = 1 */,
    CENTER /* = 2 */,
    FLEX_END /* = 3 */,
    STRETCH /* = 4 */,
    BASELINE /* = 5 */,
    SPACE_BETWEEN /* = 6 */,
    SPACE_AROUND /* = 7 */
}

external enum class Justify {
    FLEX_START /* = 0 */,
    CENTER /* = 1 */,
    FLEX_END /* = 2 */,
    SPACE_BETWEEN /* = 3 */,
    SPACE_AROUND /* = 4 */,
    SPACE_EVENLY /* = 5 */
}

external enum class Direction {
    INHERIT /* = 0 */,
    LTR /* = 1 */,
    RTL /* = 2 */
}

external enum class PositionType {
    RELATIVE /* = 0 */,
    ABSOLUTE /* = 1 */
}

external enum class Wrap {
    NO_WRAP /* = 0 */,
    WRAP /* = 1 */,
    WRAP_REVERSE /* = 2 */
}

external enum class OverFlow {
    VISIBLE /* = 0 */,
    HIDDEN /* = 1 */,
    SCROLL /* = 2 */
}

external enum class Display {
    FLEX /* = 0 */,
    NONE /* = 1 */
}