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


external interface IObservable<T> {
    fun addObserver(observer: Observer<T?>)
    fun removeObserver(observer: Observer<T?>)
    fun update(updater: Updater<T?>)
}

external open class Observable<M>(provider: IProvider, clz: Any) : IObservable<M> {
    open var provider: Any
    open var clz: Any
    open var observers: Any
    override fun addObserver(observer: Observer<M?>)
    override fun removeObserver(observer: Observer<M?>)
    override fun update(updater: Updater<M?>)
}

external interface IProvider {
    fun provide(obj: Any)
    fun <T> acquire(clz: Any): T?
    fun <T> remove(clz: Any)
    fun clear()
    fun <T> observe(clz: Any): Observable<T>
}

external open class Provider : IProvider {
    open var provision: Any
    open var observableMap: Any
    override fun provide(obj: Any)
    override fun <T> acquire(clz: Any): T?
    override fun <T> remove(clz: Any)
    override fun clear()
    override fun <T> observe(clz: Any): Observable<T>
}