@file:JsQualifier("doric")

@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION"
)

package doric.ui

import doric.util.Modeling
import kotlin.js.*

external enum class RepeatMode {
    RESTART /* = 1 */,
    REVERSE /* = 2 */
}

external interface IAnimation : Modeling {
    var duration: Number
    var delay: Number?
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

abstract external class Animation : IAnimation {
    override var duration: Number
    override var delay: Number?
    open var repeatCount: Number?
    open var repeatMode: RepeatMode?
    open var fillMode: FillMode?
    open var timingFunction: TimingFunction?
    override fun toModel(): dynamic
}

open external class ScaleAnimation : Animation {
    var fromScaleX: Number
    var toScaleX: Number
    var fromScaleY: Number
    var toScaleY: Number
}

open external class TranslationAnimation : Animation {
    var fromTranslationX: Number
    var toTranslationX: Number
    var fromTranslationY: Number
    var toTranslationY: Number
}

open external class RotationAnimation : Animation {
    var fromRotation: Number
    var toRotation: Number
}


open external class AnimationSet : IAnimation {
    open fun addAnimation(anim: IAnimation)
    override var duration: Number
    override var delay: Number?
    override fun toModel(): dynamic
}