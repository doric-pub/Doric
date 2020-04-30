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
import doric.ui.Position
import doric.ui.Scrollable
import doric.ui.Superview
import doric.ui.View
import kotlin.js.*


open external class Scroller : Superview, Scrollable {
    open var onScroll: (offset: Position) -> Unit
    open var onScrollEnd: (offset: Position) -> Unit
    var contentOffset: Position?
    var content: View?
    open fun scrollTo(context: BridgeContext, offset: Position, animated: Boolean = definedExternally): Promise<Any>
    open fun scrollBy(context: BridgeContext, offset: Position, animated: Boolean = definedExternally): Promise<Any>
}