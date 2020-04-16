package doric

import kotlin.js.json

typealias Setter<M> = (state: M) -> Unit

typealias ViewModelClass<M, V> = Any

typealias ViewHolderClass<V> = Any

typealias Observer<T> = (v: T) -> Unit

typealias Updater<T> = (v: T) -> T

typealias Binder<T> = (v: T) -> Unit


data class KBorder(
    override var color: Color,
    override var width: Number
) : `T$2`, Modeling {
    override fun toModel(): dynamic {
        return json(
            "width" to this.width,
            "color" to this.color.toModel()
        )
    }
}

data class KEdge(
    override var left: Number? = null,
    override var right: Number? = null,
    override var top: Number? = null,
    override var bottom: Number? = null
) : `T$4`, Modeling {
    override fun toModel(): dynamic {
        return json(
        ).also { ret ->
            this.left?.let {
                ret["left"] = it
            }
            this.right?.let {
                ret["right"] = it
            }
            this.top?.let {
                ret["top"] = it
            }
            this.bottom?.let {
                ret["bottom"] = it
            }
        }
    }
}

data class KLayoutConfig(
    override var widthSpec: LayoutSpec? = null,
    override var heightSpec: LayoutSpec? = null,
    override var margin: `T$4`? = null,
    override var weight: Number? = null,
    override var alignment: Gravity? = null,
    override var maxWidth: Number? = null,
    override var maxHeight: Number? = null,
    override var minWidth: Number? = null,
    override var minHeight: Number? = null
) : LayoutConfig, Modeling {
    override fun toModel(): dynamic {
        return json(
        ).also { ret ->
            this.widthSpec?.let {
                ret["widthSpec"] = it
            }
            this.heightSpec?.let {
                ret["heightSpec"] = it
            }
            this.margin?.let {
                ret["margin"] =
                    (if (it is KEdge) {
                        it.toModel()
                    } else {
                        it
                    }) as? Any
            }
            this.weight?.let {
                ret["weight"] = it
            }
            this.alignment?.let {
                ret["alignment"] = it.toModel()
            }
            this.maxWidth?.let {
                ret["maxWidth"] = it
            }
            this.maxHeight?.let {
                ret["maxHeight"] = it
            }
            this.minWidth?.let {
                ret["minWidth"] = it
            }
            this.minHeight?.let {
                ret["minHeight"] = it
            }
        }
    }
}