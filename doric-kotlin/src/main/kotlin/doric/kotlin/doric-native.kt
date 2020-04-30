package doric.kotlin

import doric.BridgeContext
import doric.native.*
import doric.ui.Scrollable
import doric.ui.View
import doric.util.Modeling
import kotlin.js.Json
import kotlin.js.Promise
import kotlin.js.json

/**
 *
 * @Description:    Kotlin wrapper of Doric Native Plugins
 * @Author:         pengfei.zhou
 * @CreateDate:     2020/4/30
 */

fun BridgeContext.animate(duration: Number, animates: () -> Unit): Promise<Any> {
    val argument: AnimateArgument = json("animations" to animates, "duration" to duration).unsafeCast<AnimateArgument>()
    return animate(this)(argument)
}


data class AlertArg(
    val title: String? = null,
    val msg: String,
    val okLabel: String? = null
) : Modeling {
    override fun toModel(): dynamic {
        return json().also { json ->
            this.title?.let {
                json["title"] = it
            }
            this.msg.let {
                json["title"] = it
            }
            this.okLabel?.let {
                json["okLabel"] = it
            }
        }
    }
}

data class ConfirmArg(
    val title: String? = null,
    val msg: String,
    val okLabel: String? = null,
    val cancelLabel: String? = null
) : Modeling {
    override fun toModel(): dynamic {
        return json().also { json ->
            this.title?.let {
                json["title"] = it
            }
            this.msg.let {
                json["title"] = it
            }
            this.okLabel?.let {
                json["okLabel"] = it
            }
            this.cancelLabel?.let {
                json["cancelLabel"] = it
            }
        }
    }
}


data class PromptArg(
    val title: String? = null,
    val msg: String? = null,
    val okLabel: String? = null,
    val cancelLabel: String? = null,
    val text: String? = null,
    val defaultText: String? = null
) : Modeling {
    override fun toModel(): dynamic {
        return json().also { json ->
            this.title?.let {
                json["title"] = it
            }
            this.msg?.let {
                json["title"] = it
            }
            this.okLabel?.let {
                json["okLabel"] = it
            }
            this.cancelLabel?.let {
                json["cancelLabel"] = it
            }
            this.text?.let {
                json["text"] = it
            }
            this.defaultText?.let {
                json["defaultText"] = it
            }
        }
    }
}

fun BridgeContext.toast(msg: String, gravity: Gravity = Gravity.Bottom) {
    return modal(this).toast(msg, gravity)
}

fun BridgeContext.alert(msg: String): Promise<Any> {
    return modal(this).alert(msg)
}

fun BridgeContext.alert(args: AlertArg): Promise<Any> {
    return modal(this).alert(args.toModel())
}

fun BridgeContext.confirm(args: String): Promise<Any> {
    return modal(this).confirm(args)
}


fun BridgeContext.confirm(args: ConfirmArg): Promise<Any> {
    return modal(this).confirm(args)
}

fun BridgeContext.prompt(args: PromptArg): Promise<Any> {
    return modal(this).prompt(args)
}


data class ScrollRange(val start: Number, val end: Number) : Modeling {
    override fun toModel(): dynamic {
        return json("start" to start, "end" to end)
    }
}

data class Changing(val name: String, val start: Number, val end: Number) : Modeling {
    override fun toModel(): dynamic {
        return json("name" to name, "start" to start, "end" to end)
    }
}


fun BridgeContext.coordinate(
    scrollable: Scrollable,
    scrollRange: ScrollRange,
    target: View,
    changing: Changing
) {
    return coordinator(this).verticalScrolling(
        json(
            "scrollable" to scrollable,
            "scrollRange" to scrollRange,
            "target" to target,
            "changing" to changing
        )
    )
}

fun BridgeContext.coordinateNavBar(
    scrollable: Scrollable,
    scrollRange: ScrollRange,
    changing: Changing
) {
    return coordinator(this).verticalScrolling(
        json(
            "scrollable" to scrollable,
            "scrollRange" to scrollRange,
            "target" to "NavBar",
            "changing" to changing
        )
    )
}

fun BridgeContext.showPopover(v: View): Promise<Any> {
    return popover(this).show(v)
}

fun BridgeContext.dismissPopover(v: View? = null): Promise<Any> {
    return popover(this).dismiss(v)
}