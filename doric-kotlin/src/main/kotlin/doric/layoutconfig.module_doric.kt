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

external enum class LayoutSpec {
    JUST /* = 0 */,
    FIT /* = 1 */,
    MOST /* = 2 */
}

external interface LayoutConfig {
    var widthSpec: LayoutSpec?
        get() = definedExternally
        set(value) = definedExternally
    var heightSpec: LayoutSpec?
        get() = definedExternally
        set(value) = definedExternally
    var margin: `T$4`?
        get() = definedExternally
        set(value) = definedExternally
    var alignment: Gravity?
        get() = definedExternally
        set(value) = definedExternally
    var weight: Number?
        get() = definedExternally
        set(value) = definedExternally
    var maxWidth: Number?
        get() = definedExternally
        set(value) = definedExternally
    var maxHeight: Number?
        get() = definedExternally
        set(value) = definedExternally
    var minWidth: Number?
        get() = definedExternally
        set(value) = definedExternally
    var minHeight: Number?
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$8` {
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

external interface `T$9` {
    var widthSpec: LayoutSpec?
        get() = definedExternally
        set(value) = definedExternally
    var heightSpec: LayoutSpec?
        get() = definedExternally
        set(value) = definedExternally
    var margin: dynamic /* `T$8` | Nothing? */
        get() = definedExternally
        set(value) = definedExternally
    var alignment: Number?
        get() = definedExternally
        set(value) = definedExternally
    var weight: Number?
        get() = definedExternally
        set(value) = definedExternally
}

external open class LayoutConfigImpl : LayoutConfig, Modeling {
    open fun fit(): LayoutConfigImpl /* this */
    open fun most(): LayoutConfigImpl /* this */
    open fun just(): LayoutConfigImpl /* this */
    open fun configWidth(w: LayoutSpec): LayoutConfigImpl /* this */
    open fun configHeight(h: LayoutSpec): LayoutConfigImpl /* this */
    open fun configMargin(m: `T$4`): LayoutConfigImpl /* this */
    open fun configAlignment(a: Gravity): LayoutConfigImpl /* this */
    open fun configWeight(w: Number): LayoutConfigImpl /* this */
    open fun configMaxWidth(v: Number): LayoutConfigImpl /* this */
    open fun configMaxHeight(v: Number): LayoutConfigImpl /* this */
    open fun configMinWidth(v: Number): LayoutConfigImpl /* this */
    open fun configMinHeight(v: Number): LayoutConfigImpl /* this */
    override fun toModel(): `T$9`
}

external fun layoutConfig(): LayoutConfigImpl