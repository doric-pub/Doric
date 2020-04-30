@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.ui

import doric.BridgeContext
import doric.kotlin.*
import doric.util.Color
import doric.util.Modeling
import kotlin.js.*

external fun Property(target: Any, propKey: String)

external interface Size {
    var width: Number
    var height: Number
}

external interface Position {
    var x: Number
    var y: Number
}

external interface Scrollable {}
open external class View : Modeling {
    var width: Number?

    var height: Number?

    var x: Number

    var y: Number

    var backgroundColor: Color?//Color | GradientColor

    var corners: Corners?

    var border: Border?

    var shadow: Shadow?

    var alpha: Number?

    var hidden: Boolean?

    var padding: Edge?

    var layoutConfig: LayoutConfig?

    var onClick: Function<*>?

    var superview: Superview?

    var left: Number?

    var right: Number?

    var top: Number?

    var bottom: Number?

    var centerX: Number?

    var centerY: Number?

    override fun toModel(): Json

    open fun `in`(group: Group): View /* this */

    open fun nativeChannel(context: BridgeContext, name: String): (args: Any) -> Promise<Any>

    open fun getWidth(context: BridgeContext): Promise<Number>

    open fun getHeight(context: BridgeContext): Promise<Number>

    open fun getX(context: BridgeContext): Promise<Number>

    open fun getY(context: BridgeContext): Promise<Number>

    open fun getLocationOnScreen(context: BridgeContext): Promise<Position>

    open fun doAnimation(context: BridgeContext, animation: IAnimation): Promise<Unit>

    var translationX: Number?

    var translationY: Number?

    var scaleX: Number?

    var scaleY: Number?

    var pivotX: Number?

    var pivotY: Number?

    var rotation: Number?

    var flexConfig: FlexConfig?

    open fun isDirty(): Boolean

    open fun clean()
}

abstract external class Superview : View {
    open fun subviewById(id: String): View?
    open fun allSubviews(): Iterable<View>
}

abstract external class Group : Superview {
    val children: Array<View>
    override fun allSubviews(): Array<View>
    open fun addChild(view: View)
}