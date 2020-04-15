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

external open class ViewHolder {
    open fun build(root: Group)
}

abstract external class ViewModel<M : Any, V : ViewHolder>(obj: M, v: V) {
    open var state: Any
    open var viewHolder: Any
    open fun getState(): M
    open fun getViewHolder(): V
    open fun updateState(setter: Setter<M>)
    open fun attach(view: Group)
    abstract fun onAttached(state: M, vh: V)
    abstract fun onBind(state: M, vh: V)
}


abstract external class VMPanel<M : Any, V : ViewHolder> : Panel {
    abstract fun getViewModelClass(): ViewModelClass<M, V>
    abstract fun getState(): M
    abstract fun getViewHolderClass(): ViewHolderClass<V>
    open fun getViewModel(): ViewModel<M, V>?
    override fun build(root: Group)
}