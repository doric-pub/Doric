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

external interface IText : IView {
    var text: String?
        get() = definedExternally
        set(value) = definedExternally
    var textColor: Color?
        get() = definedExternally
        set(value) = definedExternally
    var textSize: Number?
        get() = definedExternally
        set(value) = definedExternally
    var maxLines: Number?
        get() = definedExternally
        set(value) = definedExternally
    var textAlignment: Gravity?
        get() = definedExternally
        set(value) = definedExternally
    var fontStyle: String /* "normal" | "bold" | "italic" | "bold_italic" */
    var font: String?
        get() = definedExternally
        set(value) = definedExternally
    var maxWidth: Number?
        get() = definedExternally
        set(value) = definedExternally
    var maxHeight: Number?
        get() = definedExternally
        set(value) = definedExternally
    var lineSpacing: Number?
        get() = definedExternally
        set(value) = definedExternally
    var strikethrough: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var underline: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var htmlText: String?
        get() = definedExternally
        set(value) = definedExternally
}

external open class Text : View, IText {
    override var fontStyle: String /* "normal" | "bold" | "italic" | "bold_italic" */
}

external fun text(config: IText): Text