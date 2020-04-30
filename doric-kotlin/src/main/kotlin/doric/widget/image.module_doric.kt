@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.widget

import doric.ui.Size
import doric.ui.View
import doric.util.Color
import kotlin.js.*

external enum class ScaleType {
    ScaleToFill /* = 0 */,
    ScaleAspectFit /* = 1 */,
    ScaleAspectFill /* = 2 */
}

open external class Image : View {
    var imageUrl: String?
    var imagePath: String?
    var imageRes: String?
    var imageBase64: String?
    var scaleType: ScaleType?
    var isBlur: Boolean?
    var placeHolderImage: String?
    var placeHolderColor: Color?
    var errorImage: String?
    var errorColor: Color?
    var loadCallback: ((image: Size) -> Unit)?
}