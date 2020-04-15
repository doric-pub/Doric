@file:JsQualifier("doric")
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
import IterableIterator

abstract external class Panel {
    open var context: BridgeContext
    open fun onCreate()
    open fun onDestroy()
    open fun onShow()
    open fun onHidden()
    abstract fun build(rootView: Group)
    open fun addHeadView(type: String, v: View)
    open fun allHeadViews(): IterableIterator<Map<String, View>>
    open fun removeHeadView(type: String, v: View)
    open fun removeHeadView(type: String, v: String)
    open fun clearHeadViews(type: String)
    open fun getRootView(): Root
    open fun getInitData(): Any?
    open fun addOnRenderFinishedCallback(cb: () -> Unit)
}