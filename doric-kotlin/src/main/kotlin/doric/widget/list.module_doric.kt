@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.widget

import doric.ui.Position
import doric.ui.Scrollable
import doric.ui.Superview
import kotlin.js.*


open external class ListItem : Stack {
    var identifier: String?
}

open external class List : Superview, Scrollable {
    var itemCount: Number
    var renderItem: (index: Number) -> ListItem
    var batchCount: Number?
    var onLoadMore: (() -> Unit)?
    var loadMore: Boolean?
    var loadMoreView: ListItem?
    var onScroll: ((offset: Position) -> Unit)?
    var onScrollEnd: ((offset: Position) -> Unit)?
    open fun reset()
}
