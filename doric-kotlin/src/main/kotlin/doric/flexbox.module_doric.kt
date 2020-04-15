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

external enum class ValueType {
    Undefined /* = 0 */,
    Point /* = 1 */,
    Percent /* = 2 */,
    Auto /* = 3 */
}

external interface `T$13` {
    var type: ValueType
    var value: Number
}

external open class FlexTypedValue(type: ValueType) : Modeling {
    open var type: ValueType
    open var value: Number
    override fun toModel(): `T$13`

    companion object {
        var Auto: FlexTypedValue
        fun percent(v: Number): FlexTypedValue
        fun point(v: Number): FlexTypedValue
    }
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

external interface FlexConfig {
    var direction: Direction?
        get() = definedExternally
        set(value) = definedExternally
    var flexDirection: FlexDirection?
        get() = definedExternally
        set(value) = definedExternally
    var justifyContent: Justify?
        get() = definedExternally
        set(value) = definedExternally
    var alignContent: Align?
        get() = definedExternally
        set(value) = definedExternally
    var alignItems: Align?
        get() = definedExternally
        set(value) = definedExternally
    var alignSelf: Align?
        get() = definedExternally
        set(value) = definedExternally
    var positionType: PositionType?
        get() = definedExternally
        set(value) = definedExternally
    var flexWrap: Wrap?
        get() = definedExternally
        set(value) = definedExternally
    var overFlow: OverFlow?
        get() = definedExternally
        set(value) = definedExternally
    var display: Display?
        get() = definedExternally
        set(value) = definedExternally
    var flex: Number?
        get() = definedExternally
        set(value) = definedExternally
    var flexGrow: Number?
        get() = definedExternally
        set(value) = definedExternally
    var flexShrink: Number?
        get() = definedExternally
        set(value) = definedExternally
    var flexBasis: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var marginLeft: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var marginRight: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var marginTop: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var marginBottom: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var marginStart: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var marginEnd: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var marginHorizontal: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var marginVertical: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var margin: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var paddingLeft: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var paddingRight: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var paddingTop: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var paddingBottom: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var paddingStart: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var paddingEnd: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var paddingHorizontal: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var paddingVertical: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var padding: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var borderLeftWidth: Number?
        get() = definedExternally
        set(value) = definedExternally
    var borderRightWidth: Number?
        get() = definedExternally
        set(value) = definedExternally
    var borderTopWidth: Number?
        get() = definedExternally
        set(value) = definedExternally
    var borderBottomWidth: Number?
        get() = definedExternally
        set(value) = definedExternally
    var borderStartWidth: Number?
        get() = definedExternally
        set(value) = definedExternally
    var borderEndWidth: Number?
        get() = definedExternally
        set(value) = definedExternally
    var borderWidth: Number?
        get() = definedExternally
        set(value) = definedExternally
    var left: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var right: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var top: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var bottom: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var start: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var end: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var width: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var height: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var minWidth: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var minHeight: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var maxWidth: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var maxHeight: dynamic /* FlexTypedValue | Number */
        get() = definedExternally
        set(value) = definedExternally
    var aspectRatio: Number?
        get() = definedExternally
        set(value) = definedExternally
}