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

external fun scroller(content: View, config: IScroller = definedExternally): Scroller

external interface IScroller : IView {
    var content: View?
        get() = definedExternally
        set(value) = definedExternally
    var contentOffset: `T$6`?
        get() = definedExternally
        set(value) = definedExternally
}

external open class Scroller : Superview, IScroller {
    open var onScroll: (offset: `T$6`) -> Unit
    open var onScrollEnd: (offset: `T$6`) -> Unit
    override fun allSubviews(): Array<View>
    override fun toModel(): NativeViewModel
    open fun scrollTo(context: BridgeContext, offset: `T$6`, animated: Boolean = definedExternally): Promise<Any>
    open fun scrollBy(context: BridgeContext, offset: `T$6`, animated: Boolean = definedExternally): Promise<Any>
}