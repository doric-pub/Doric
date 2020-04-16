@file:JsQualifier("doric")
@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

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

external interface IStack : IView

external open class Stack : Group, IStack

external open class Root : Stack

external open class LinearLayout : Group {
    open var space: Number?
    open var gravity: Gravity?
}

external interface IVLayout : IView {
    var space: Number?
        get() = definedExternally
        set(value) = definedExternally
    var gravity: Gravity?
        get() = definedExternally
        set(value) = definedExternally
}

external open class VLayout : LinearLayout, IVLayout {
    override var space: Number?
        get() = definedExternally
        set(value) = definedExternally
    override var gravity: Gravity?
        get() = definedExternally
        set(value) = definedExternally
}

external interface IHLayout : IView {
    var space: Number?
        get() = definedExternally
        set(value) = definedExternally
    var gravity: Gravity?
        get() = definedExternally
        set(value) = definedExternally
}

external open class HLayout : LinearLayout, IHLayout {
    override var space: Number?
        get() = definedExternally
        set(value) = definedExternally
    override var gravity: Gravity?
        get() = definedExternally
        set(value) = definedExternally
}

external fun stack(views: Array<View>, config: IStack = definedExternally): Stack

external fun hlayout(views: Array<View>, config: IHLayout = definedExternally): HLayout

external fun vlayout(views: Array<View>, config: IVLayout = definedExternally): VLayout

external open class FlexLayout : Group

external fun flexlayout(views: Array<View>, config: IView = definedExternally): FlexLayout