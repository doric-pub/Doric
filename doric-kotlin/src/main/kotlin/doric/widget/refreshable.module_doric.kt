@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.widget

import doric.BridgeContext
import doric.ui.Superview
import doric.ui.View
import kotlin.js.*

open external class Refreshable : Superview {
    var content: View
    var header: View?
    var onRefresh: (() -> Unit)?
    open fun setRefreshable(context: BridgeContext, refreshable: Boolean): Promise<Any>
    open fun setRefreshing(context: BridgeContext, refreshing: Boolean): Promise<Any>
    open fun isRefreshable(context: BridgeContext): Promise<Boolean>
    open fun isRefreshing(context: BridgeContext): Promise<Boolean>
}

external interface IPullable {
    fun startAnimation()
    fun stopAnimation()
    fun setPullingDistance(distance: Number)
}

external fun pullable(v: View, config: IPullable): View