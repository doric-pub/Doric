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

external enum class RepeatMode {
    RESTART /* = 1 */,
    REVERSE /* = 2 */
}

external interface IAnimation : Modeling {
    var duration: Number
    var delay: Number?
        get() = definedExternally
        set(value) = definedExternally
}

external interface Changeable {
    var fromValue: Number
    var toValue: Number
    var key: String /* "translationX" | "translationY" | "scaleX" | "scaleY" | "rotation" | "pivotX" | "pivotY" */
    var repeatCount: Number?
        get() = definedExternally
        set(value) = definedExternally
    var repeatMode: RepeatMode?
        get() = definedExternally
        set(value) = definedExternally
}

external enum class FillMode {
    Removed /* = 0 */,
    Forward /* = 1 */,
    Backward /* = 2 */,
    Both /* = 3 */
}

external enum class TimingFunction {
    Default /* = 0 */,
    Linear /* = 1 */,
    EaseIn /* = 2 */,
    EaseOut /* = 3 */,
    EaseInEaseOut /* = 4 */
}

external interface `T$10` {
    var key: String /* "translationX" | "translationY" | "scaleX" | "scaleY" | "rotation" | "pivotX" | "pivotY" */
    var fromValue: Number
    var toValue: Number
}

external interface `T$11` {
    var type: String
    var delay: Number?
        get() = definedExternally
        set(value) = definedExternally
    var duration: Number
    var changeables: Array<`T$10`>
    var repeatCount: Number?
        get() = definedExternally
        set(value) = definedExternally
    var repeatMode: RepeatMode?
        get() = definedExternally
        set(value) = definedExternally
    var fillMode: FillMode
    var timingFunction: TimingFunction?
        get() = definedExternally
        set(value) = definedExternally
}

external open class Animation : IAnimation {
    open var changeables: Any
    override var duration: Number
    open var repeatCount: Number
    open var repeatMode: RepeatMode
    open var fillMode: FillMode
    open var timingFunction: TimingFunction
    override fun toModel(): `T$11`
}

external open class ScaleAnimation : Animation {
    open var scaleXChangeable: Any
    open var scaleYChangeable: Any
}

external open class TranslationAnimation : Animation {
    open var translationXChangeable: Any
    open var translationYChangeable: Any
}

external open class RotationAnimation : Animation {
    open var rotationChaneable: Any
}

external interface `T$12` {
    var animations: Any
    var delay: Number?
        get() = definedExternally
        set(value) = definedExternally
}

external open class AnimationSet : IAnimation {
    open var animations: Any
    open fun addAnimation(anim: IAnimation)
    override var duration: Number
    override fun toModel(): `T$12`
}