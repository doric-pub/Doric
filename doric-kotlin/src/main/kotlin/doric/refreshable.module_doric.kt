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

external interface IRefreshable : IView {
    var content: View
    var header: View?
        get() = definedExternally
        set(value) = definedExternally
    var onRefresh: (() -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
}

external open class Refreshable : Superview, IRefreshable {
    override var content: dynamic /* List | Scroller */
    override fun allSubviews(): Array<View>
    open fun setRefreshable(context: BridgeContext, refreshable: Boolean): Promise<Any>
    open fun setRefreshing(context: BridgeContext, refreshing: Boolean): Promise<Any>
    open fun isRefreshable(context: BridgeContext): Promise<Boolean>
    open fun isRefreshing(context: BridgeContext): Promise<Boolean>
    override fun toModel(): NativeViewModel
}

external fun refreshable(config: IRefreshable): Refreshable

external interface IPullable {
    fun startAnimation()
    fun stopAnimation()
    fun setPullingDistance(distance: Number)
}

external fun pullable(v: View, config: IPullable): View