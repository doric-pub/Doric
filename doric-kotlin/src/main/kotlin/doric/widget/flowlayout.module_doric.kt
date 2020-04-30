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


open external class FlowLayoutItem : Stack {
    var identifier: String?
}


open external class FlowLayout : Superview, Scrollable {
    var renderItem: (index: Number) -> FlowLayoutItem
    var itemCount: Number
    var batchCount: Number?
    var columnCount: Number?
    var columnSpace: Number?
    var rowSpace: Number?
    var loadMore: Boolean?
    var onLoadMore: (() -> Unit)?
    var loadMoreView: FlowLayoutItem?
    var onScroll: ((offset: Position) -> Unit)?
    var onScrollEnd: ((offset: Position) -> Unit)?
}
