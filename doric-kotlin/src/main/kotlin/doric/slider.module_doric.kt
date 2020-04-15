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
import IterableIterator

external interface ISlideItem : IStack {
    override var identifier: String?
        get() = definedExternally
        set(value) = definedExternally
}

external open class SlideItem : Stack, ISlideItem

external interface ISlider : IView {
    var renderPage: (index: Number) -> SlideItem
    var itemCount: Number
    var batchCount: Number?
        get() = definedExternally
        set(value) = definedExternally
    var onPageSlided: ((index: Number) -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
    var loop: Boolean?
        get() = definedExternally
        set(value) = definedExternally
}

external open class Slider : Superview, ISlider {
    open var cachedViews: Any
    open var ignoreDirtyCallOnce: Any
    override fun allSubviews(): IterableIterator<SlideItem>
    override var itemCount: Number
    override var renderPage: (index: Number) -> SlideItem
    open var getItem: Any
    override fun isDirty(): Boolean
    open var renderBunchedItems: Any
    open fun slidePage(context: BridgeContext, page: Number, smooth: Boolean = definedExternally): Promise<Any>
    open fun getSlidedPage(context: BridgeContext): Promise<Number>
}

external fun slider(config: ISlider): Slider

external fun slideItem(item: View, config: ISlideItem = definedExternally): SlideItem

external fun slideItem(item: Array<View>, config: ISlideItem = definedExternally): SlideItem