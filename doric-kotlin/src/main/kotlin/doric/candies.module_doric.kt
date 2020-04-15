@file:JsQualifier("doric")
@file:Suppress("INTERFACE_WITH_SUPERCLASS", "OVERRIDING_FINAL_MEMBER", "RETURN_TYPE_MISMATCH_ON_OVERRIDE", "CONFLICTING_OVERLOADS", "EXTERNAL_DELEGATION")

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

external fun <T> take(target: T): (block: (p: T) -> Unit) -> Unit

external fun <T, R> takeNonNull(target: T = definedExternally): (block: (p: T) -> R) -> R?

external fun <T, R> takeNull(target: T = definedExternally): (block: () -> R) -> R?

external fun <T, R> takeLet(target: T): (block: (p: T) -> R?) -> R?

external fun <T> takeAlso(target: T): (block: (p: T) -> Unit) -> T

external fun <T> takeIf(target: T): (predicate: (t: T) -> Boolean) -> T?

external fun <T> takeUnless(target: T): (predicate: (t: T) -> Boolean) -> T?

external fun repeat(action: (count: Number) -> Unit): (times: Number) -> Unit