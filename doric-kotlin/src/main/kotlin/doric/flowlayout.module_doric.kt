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

external interface IFlowLayoutItem : IStack {
    override var identifier: String?
        get() = definedExternally
        set(value) = definedExternally
}

external open class FlowLayoutItem : Stack, IFlowLayoutItem

external interface IFlowLayout : IView {
    var renderItem: (index: Number) -> FlowLayoutItem
    var itemCount: Number
    var batchCount: Number?
        get() = definedExternally
        set(value) = definedExternally
    var columnCount: Number?
        get() = definedExternally
        set(value) = definedExternally
    var columnSpace: Number?
        get() = definedExternally
        set(value) = definedExternally
    var rowSpace: Number?
        get() = definedExternally
        set(value) = definedExternally
    var loadMore: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var onLoadMore: (() -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
    var loadMoreView: FlowLayoutItem?
        get() = definedExternally
        set(value) = definedExternally
    var onScroll: ((offset: `T$6`) -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
    var onScrollEnd: ((offset: `T$6`) -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
}

external open class FlowLayout : Superview, IFlowLayout {
    open var cachedViews: Any
    open var ignoreDirtyCallOnce: Any
    override fun allSubviews(): dynamic /* IterableIterator<FlowLayoutItem> | Array<FlowLayoutItem> */
    override var itemCount: Number
    override var renderItem: (index: Number) -> FlowLayoutItem
    open fun reset()
    open var getItem: Any
    override fun isDirty(): Boolean
    open var renderBunchedItems: Any
    override fun toModel(): NativeViewModel
}

external fun flowlayout(config: IFlowLayout): FlowLayout

external fun flowItem(item: View, config: IFlowLayoutItem = definedExternally): FlowLayoutItem

external fun flowItem(item: Array<View>, config: IFlowLayoutItem = definedExternally): FlowLayoutItem