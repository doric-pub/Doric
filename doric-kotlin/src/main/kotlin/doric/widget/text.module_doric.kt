@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.widget

import doric.kotlin.FontStyle
import doric.kotlin.Gravity
import doric.ui.View
import doric.util.Color
import kotlin.js.*

open external class Text : View {
    var text: String?
    var textColor: Color?
    var textSize: Number?
    var maxLines: Number?
    var textAlignment: Gravity?
    var fontStyle: FontStyle?
    var font: String?
    var maxWidth: Number?
    var maxHeight: Number?
    var lineSpacing: Number?
    var strikethrough: Boolean?
    var underline: Boolean?
    var htmlText: String?
}