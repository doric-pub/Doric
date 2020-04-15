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

external enum class ScaleType {
    ScaleToFill /* = 0 */,
    ScaleAspectFit /* = 1 */,
    ScaleAspectFill /* = 2 */
}

external interface `T$14` {
    var width: Number
    var height: Number
}

external interface IImage : IView {
    var imageUrl: String?
        get() = definedExternally
        set(value) = definedExternally
    var imagePath: String?
        get() = definedExternally
        set(value) = definedExternally
    var imageRes: String?
        get() = definedExternally
        set(value) = definedExternally
    var imageBase64: String?
        get() = definedExternally
        set(value) = definedExternally
    var scaleType: ScaleType?
        get() = definedExternally
        set(value) = definedExternally
    var isBlur: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var placeHolderImage: String?
        get() = definedExternally
        set(value) = definedExternally
    var placeHolderColor: Color?
        get() = definedExternally
        set(value) = definedExternally
    var errorImage: String?
        get() = definedExternally
        set(value) = definedExternally
    var errorColor: Color?
        get() = definedExternally
        set(value) = definedExternally
    var loadCallback: ((image: dynamic /* `T$14` | Nothing? */) -> Unit)?
        get() = definedExternally
        set(value) = definedExternally
}

external open class Image : View, IImage

external fun image(config: IImage): Image