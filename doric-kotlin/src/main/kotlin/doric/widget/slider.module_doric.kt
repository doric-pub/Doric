@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.widget

import kotlin.js.*
import doric.BridgeContext
import doric.ui.Superview


open external class SlideItem : Stack {
    var identifier: String
}

open external class Slider : Superview {
    var itemCount: Number
    var renderPage: (index: Number) -> SlideItem
    var batchCount: Number?
    var onPageSlided: ((index: Number) -> Unit)?
    var loop: Boolean?
    fun slidePage(context: BridgeContext, page: Number, smooth: Boolean = definedExternally): Promise<Any>
    fun getSlidedPage(context: BridgeContext): Promise<Number>
}
