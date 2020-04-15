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

external fun Property(target: Any, propKey: String)

external interface `T$1` {
    var leftTop: Number?
        get() = definedExternally
        set(value) = definedExternally
    var rightTop: Number?
        get() = definedExternally
        set(value) = definedExternally
    var leftBottom: Number?
        get() = definedExternally
        set(value) = definedExternally
    var rightBottom: Number?
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$2` {
    var width: Number
    var color: Color
}

external interface `T$3` {
    var color: Color
    var opacity: Number
    var radius: Number
    var offsetX: Number
    var offsetY: Number
}

external interface `T$4` {
    var left: Number?
        get() = definedExternally
        set(value) = definedExternally
    var right: Number?
        get() = definedExternally
        set(value) = definedExternally
    var top: Number?
        get() = definedExternally
        set(value) = definedExternally
    var bottom: Number?
        get() = definedExternally
        set(value) = definedExternally
}

external interface IView {
    var width: Number?
        get() = definedExternally
        set(value) = definedExternally
    var height: Number?
        get() = definedExternally
        set(value) = definedExternally
    var backgroundColor: dynamic /* Color | GradientColor */
        get() = definedExternally
        set(value) = definedExternally
    var corners: dynamic /* Number | `T$1` */
        get() = definedExternally
        set(value) = definedExternally
    var border: `T$2`?
        get() = definedExternally
        set(value) = definedExternally
    var shadow: `T$3`?
        get() = definedExternally
        set(value) = definedExternally
    var alpha: Number?
        get() = definedExternally
        set(value) = definedExternally
    var hidden: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var padding: `T$4`?
        get() = definedExternally
        set(value) = definedExternally
    var layoutConfig: LayoutConfig?
        get() = definedExternally
        set(value) = definedExternally
    var onClick: Function<*>?
        get() = definedExternally
        set(value) = definedExternally
    var identifier: String?
        get() = definedExternally
        set(value) = definedExternally
    var translationX: Number?
        get() = definedExternally
        set(value) = definedExternally
    var translationY: Number?
        get() = definedExternally
        set(value) = definedExternally
    var scaleX: Number?
        get() = definedExternally
        set(value) = definedExternally
    var scaleY: Number?
        get() = definedExternally
        set(value) = definedExternally
    var pivotX: Number?
        get() = definedExternally
        set(value) = definedExternally
    var pivotY: Number?
        get() = definedExternally
        set(value) = definedExternally
    var rotation: Number?
        get() = definedExternally
        set(value) = definedExternally
    var flexConfig: FlexConfig?
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$5` {
    @nativeGetter
    operator fun get(index: String): dynamic?

    @nativeSetter
    operator fun set(index: String, value: dynamic)
}

external interface NativeViewModel {
    var id: String
    var type: String
    var props: `T$5`
}

external interface `T$6` {
    var x: Number
    var y: Number
}

external open class View : Modeling, IView {
    open var x: Number
    open var y: Number
    override var backgroundColor: dynamic /* Color | GradientColor */
    override var corners: dynamic /* Number | `T$1` */
    open var viewId: String
    open var superview: Superview
    open var callbacks: Any
    open var callback2Id: Any
    open var id2Callback: Any
    open var __dirty_props__: Any
    open var nativeViewModel: NativeViewModel
    open fun onPropertyChanged(propKey: String, oldV: dynamic, newV: dynamic)
    open fun clean()
    open fun isDirty(): Boolean
    open fun responseCallback(id: String, vararg args: Any): Any
    override fun toModel(): NativeViewModel
    open fun let(block: (it: View /* this */) -> Unit)
    open fun also(block: (it: View /* this */) -> Unit): View /* this */
    open fun apply(config: IView): View /* this */
    open fun `in`(group: Group): View /* this */
    open fun nativeChannel(context: BridgeContext, name: String): (args: Any) -> Promise<Any>
    open fun getWidth(context: BridgeContext): Promise<Number>
    open fun getHeight(context: BridgeContext): Promise<Number>
    open fun getX(context: BridgeContext): Promise<Number>
    open fun getY(context: BridgeContext): Promise<Number>
    open fun getLocationOnScreen(context: BridgeContext): Promise<`T$6`>
    open fun doAnimation(context: BridgeContext, animation: IAnimation): Promise<Unit>
}

external open class Superview : View {
    open fun subviewById(id: String): View?
    open fun allSubviews(): Iterable<View>
    override fun isDirty(): Boolean
    override fun clean()
    override fun toModel(): NativeViewModel
}

external open class Group : Superview {
    open var children: Array<View>
    override fun allSubviews(): Array<View>
    open fun addChild(view: View)
}