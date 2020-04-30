@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.ui

import kotlin.js.*
import doric.BridgeContext
import doric.widget.Root

abstract external class Panel {
    open var context: BridgeContext
    open fun onCreate()
    open fun onDestroy()
    open fun onShow()
    open fun onHidden()
    abstract fun build(rootView: Group)
    open fun addHeadView(type: String, v: View)
    open fun allHeadViews(): Map<String, View>
    open fun removeHeadView(type: String, v: View)
    open fun removeHeadView(type: String, v: String)
    open fun clearHeadViews(type: String)
    open fun getRootView(): Root
    open fun getInitData(): Any?
    open fun addOnRenderFinishedCallback(cb: () -> Unit)
}