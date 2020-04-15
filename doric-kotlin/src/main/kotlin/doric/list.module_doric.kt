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

external interface IListItem : IStack {
    override var identifier: String?
        get() = definedExternally
        set(value) = definedExternally
}

external open class ListItem : Stack, IListItem

external interface IList : IView {
    var renderItem: (index: Number) -> ListItem
    var itemCount: Number
    var batchCount: Number?
        get() = definedExternally
        set(value) = definedExternally
    var onLoadMore: (() -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
    var loadMore: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var loadMoreView: ListItem?
        get() = definedExternally
        set(value) = definedExternally
    var onScroll: ((offset: `T$6`) -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
    var onScrollEnd: ((offset: `T$6`) -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
}

external open class List : Superview, IList {
    open var cachedViews: Any
    open var ignoreDirtyCallOnce: Any
    override fun allSubviews(): dynamic /* IterableIterator<ListItem> | Array<ListItem> */
    override var itemCount: Number
    override var renderItem: (index: Number) -> ListItem
    open fun reset()
    open var getItem: Any
    override fun isDirty(): Boolean
    open var renderBunchedItems: Any
    override fun toModel(): NativeViewModel
}

external fun list(config: IList): List

external fun listItem(item: View, config: IListItem = definedExternally): ListItem

external fun listItem(item: Array<View>, config: IListItem = definedExternally): ListItem