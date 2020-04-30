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
import doric.ui.Group
import doric.ui.View
import kotlin.js.*

open external class NestedSlider : Group {
    open var onPageSlided: (index: Number) -> Unit
    open fun addSlideItem(view: View)
    open fun slidePage(context: BridgeContext, page: Number, smooth: Boolean = definedExternally): Promise<Any>
    open fun getSlidedPage(context: BridgeContext): Promise<Number>
}