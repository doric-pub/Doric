package doric.kotlin

import doric.util.*
import kotlin.js.Json
import kotlin.js.json

/**
 *
 * @Description:    Doric models
 * @Author:         pengfei.zhou
 * @CreateDate:     2020/4/29
 */

data class Border(
    var color: Color,
    var width: Number
) : Modeling {
    override fun toModel(): dynamic {
        return json(
            "width" to this.width,
            "color" to this.color.toModel()
        )
    }
}

data class Edge(
    var left: Number? = null,
    var right: Number? = null,
    var top: Number? = null,
    var bottom: Number? = null
) : Modeling {
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


data class Shadow(
    var color: Color,
    var opacity: Number,
    var radius: Number,
    var offsetX: Number,
    var offsetY: Number
) : Modeling {
    override fun toModel(): dynamic {
        return json(
        ).also { ret ->
            ret["color"] = color.toModel()
            ret["opacity"] = opacity
            ret["radius"] = radius
            ret["offsetX"] = offsetX
            ret["offsetY"] = offsetY
        }
    }
}

data class GradientColor(
    var start: Color,
    var end: Color,
    var orientation: GradientOrientation
) : Color(0) {
    override fun toModel(): dynamic {
        return json(
        ).also { ret ->
            ret["start"] = start.toModel()
            ret["end"] = end.toModel()
            ret["orientation"] = orientation
        }
    }
}

data class Corners(
    var leftTop: Number? = null,
    var rightTop: Number? = null,
    var leftBottom: Number? = null,
    var rightBottom: Number? = null
) : Modeling {
    constructor(corner: Number) : this(corner, corner, corner, corner)

    override fun toModel(): dynamic {
        if (this.leftTop == this.rightTop
            && this.leftTop == this.leftBottom
            && this.leftTop == this.rightBottom
        ) {
            return this.leftTop
        }
        return json(
        ).also { ret ->
            this.leftTop?.let {
                ret["leftTop"] = it
            }
            this.rightTop?.let {
                ret["rightTop"] = it
            }
            this.leftBottom?.let {
                ret["leftBottom"] = it
            }
            this.rightBottom?.let {
                ret["rightBottom"] = it
            }
        }
    }
}

data class LayoutConfig(
    var widthSpec: LayoutSpec? = null,
    var heightSpec: LayoutSpec? = null,
    var margin: Edge? = null,
    var weight: Number? = null,
    var alignment: Gravity? = null,
    var maxWidth: Number? = null,
    var maxHeight: Number? = null,
    var minWidth: Number? = null,
    var minHeight: Number? = null
) : Modeling {
    fun fit(): LayoutConfig {
        this.widthSpec = LayoutSpec.FIT
        this.heightSpec = LayoutSpec.FIT
        return this
    }

    fun most(): LayoutConfig {
        this.widthSpec = LayoutSpec.MOST
        this.heightSpec = LayoutSpec.MOST
        return this
    }

    fun just(): LayoutConfig {
        this.widthSpec = LayoutSpec.JUST
        this.heightSpec = LayoutSpec.JUST
        return this
    }

    fun configWidth(w: LayoutSpec): LayoutConfig {
        this.widthSpec = w
        return this
    }

    fun configHeight(h: LayoutSpec): LayoutConfig {
        this.heightSpec = h
        return this
    }

    fun configMargin(m: Edge): LayoutConfig {
        this.margin = m
        return this
    }

    fun configAlignment(a: Gravity): LayoutConfig {
        this.alignment = a
        return this
    }

    fun configWeight(w: Number): LayoutConfig {
        this.weight = w
        return this
    }

    fun configMaxWidth(v: Number): LayoutConfig {
        this.maxWidth = v
        return this
    }

    fun configMaxHeight(v: Number): LayoutConfig {
        this.maxHeight = v
        return this
    }

    fun configMinWidth(v: Number): LayoutConfig {
        this.minWidth = v
        return this
    }

    fun configMinHeight(v: Number): LayoutConfig {
        this.minHeight = v
        return this
    }

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
                ret["margin"] = it.toModel()
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

fun layoutConfig(): LayoutConfig {
    return LayoutConfig()
}

data class Gravity(val gravity: Int) : Modeling {
    companion object {
        private val SPECIFIED = 1
        private val START = 1 shl 1
        private val END = 1 shl 2

        private val SHIFT_X = 0
        private val SHIFT_Y = 4

        private val LEFT = (START or SPECIFIED) shl SHIFT_X
        private val RIGHT = (END or SPECIFIED) shl SHIFT_X

        private val TOP = (START or SPECIFIED) shl SHIFT_Y
        private val BOTTOM = (END or SPECIFIED) shl SHIFT_Y

        private val CENTER_X = SPECIFIED shl SHIFT_X
        private val CENTER_Y = SPECIFIED shl SHIFT_Y

        private val CENTER = CENTER_X or CENTER_Y


        val Origin = Gravity(0)

        val Center = Origin.center()
        val CenterX = Origin.centerX()
        val CenterY = Origin.centerY()
        val Left = Origin.left()
        val Right = Origin.right()
        val Top = Origin.top()
        val Bottom = Origin.bottom()
    }

    override fun toModel(): dynamic {
        return this.gravity
    }

    fun left(): Gravity {
        return Gravity(this.gravity or LEFT)
    }

    fun right(): Gravity {
        return Gravity(this.gravity or RIGHT)
    }

    fun top(): Gravity {
        return Gravity(this.gravity or TOP)
    }

    fun bottom(): Gravity {
        return Gravity(this.gravity or BOTTOM)
    }

    fun center(): Gravity {
        return Gravity(this.gravity or CENTER)
    }

    fun centerX(): Gravity {
        return Gravity(this.gravity or CENTER_X)
    }

    fun centerY(): Gravity {
        return Gravity(this.gravity or CENTER_Y)
    }
}

fun gravity(): Gravity {
    return Gravity.Companion.Origin
}


data class FlexTypedValue(val type: ValueType, val value: Number) : Modeling {
    override fun toModel(): Json {
        return json().also {
            it["type"] = type.toModel()
            it["value"] = value
        }
    }

    companion object {
        val Auto = FlexTypedValue(ValueType.Auto, 0)
        fun percent(v: Number): FlexTypedValue {
            return FlexTypedValue(ValueType.Percent, v)
        }

        fun point(v: Number): FlexTypedValue {
            return FlexTypedValue(ValueType.Point, v)
        }
    }
}

data class FlexConfig(
    var direction: Direction? = null,
    var flexDirection: FlexDirection? = null,
    var justifyContent: Justify? = null,
    var alignContent: Align? = null,
    var alignItems: Align? = null,
    var alignSelf: Align? = null,
    var positionType: PositionType? = null,
    var flexWrap: Wrap? = null,
    var overFlow: OverFlow? = null,
    var display: Display? = null,
    var flex: Number? = null,
    var flexGrow: Number? = null,
    var flexShrink: Number? = null,
    var flexBasis: FlexTypedValue? = null,
    var marginLeft: FlexTypedValue? = null,
    var marginRight: FlexTypedValue? = null,
    var marginTop: FlexTypedValue? = null,
    var marginBottom: FlexTypedValue? = null,
    var marginStart: FlexTypedValue? = null,
    var marginEnd: FlexTypedValue? = null,
    var marginHorizontal: FlexTypedValue? = null,
    var marginVertical: FlexTypedValue? = null,
    var margin: FlexTypedValue? = null,
    var paddingLeft: FlexTypedValue? = null,
    var paddingRight: FlexTypedValue? = null,
    var paddingTop: FlexTypedValue? = null,
    var paddingBottom: FlexTypedValue? = null,
    var paddingStart: FlexTypedValue? = null,
    var paddingEnd: FlexTypedValue? = null,
    var paddingHorizontal: FlexTypedValue? = null,
    var paddingVertical: FlexTypedValue? = null,
    var padding: FlexTypedValue? = null,
    var borderLeftWidth: Number? = null,
    var borderRightWidth: Number? = null,
    var borderTopWidth: Number? = null,
    var borderBottomWidth: Number? = null,
    var borderStartWidth: Number? = null,
    var borderEndWidth: Number? = null,
    var borderWidth: Number? = null,
    var left: FlexTypedValue? = null,
    var right: FlexTypedValue? = null,
    var top: FlexTypedValue? = null,
    var bottom: FlexTypedValue? = null,
    var start: FlexTypedValue? = null,
    var end: FlexTypedValue? = null,
    var width: FlexTypedValue? = null,
    var height: FlexTypedValue? = null,
    var minWidth: FlexTypedValue? = null,
    var minHeight: FlexTypedValue? = null,
    var maxWidth: FlexTypedValue? = null,
    var maxHeight: FlexTypedValue? = null,
    var aspectRatio: Number? = null
) : Modeling {
    override fun toModel(): dynamic {
        return json(
        ).also { json ->
            this.direction?.also {
                json["direction"] = it
            }
            this.flexDirection?.also {
                json["flexDirection"] = it
            }
            this.justifyContent?.also {
                json["justifyContent"] = it
            }
            this.alignContent?.also {
                json["alignContent"] = it
            }
            this.alignItems?.also {
                json["alignItems"] = it
            }
            this.alignSelf?.also {
                json["alignSelf"] = it
            }
            this.positionType?.also {
                json["positionType"] = it
            }
            this.flexWrap?.also {
                json["flexWrap"] = it
            }
            this.overFlow?.also {
                json["overFlow"] = it
            }
            this.display?.also {
                json["display"] = it
            }
            this.flex?.also {
                json["flex"] = it
            }
            this.flexGrow?.also {
                json["flexGrow"] = it
            }
            this.flexShrink?.also {
                json["flexShrink"] = it
            }
            this.flexBasis?.also {
                json["flexBasis"] = it.toModel()
            }
            this.marginLeft?.also {
                json["marginLeft"] = it.toModel()
            }
            this.marginRight?.also {
                json["marginRight"] = it.toModel()
            }
            this.marginTop?.also {
                json["marginTop"] = it.toModel()
            }
            this.marginBottom?.also {
                json["marginBottom"] = it.toModel()
            }
            this.marginStart?.also {
                json["marginStart"] = it.toModel()
            }
            this.marginEnd?.also {
                json["marginEnd"] = it.toModel()
            }
            this.marginHorizontal?.also {
                json["marginHorizontal"] = it.toModel()
            }
            this.marginVertical?.also {
                json["marginVertical"] = it.toModel()
            }
            this.margin?.also {
                json["margin"] = it.toModel()
            }
            this.paddingLeft?.also {
                json["paddingLeft"] = it.toModel()
            }
            this.paddingRight?.also {
                json["paddingRight"] = it.toModel()
            }
            this.paddingTop?.also {
                json["paddingTop"] = it.toModel()
            }
            this.paddingBottom?.also {
                json["paddingBottom"] = it.toModel()
            }
            this.paddingStart?.also {
                json["paddingStart"] = it.toModel()
            }
            this.paddingEnd?.also {
                json["paddingEnd"] = it.toModel()
            }
            this.paddingHorizontal?.also {
                json["paddingHorizontal"] = it.toModel()
            }
            this.paddingVertical?.also {
                json["paddingVertical"] = it.toModel()
            }
            this.padding?.also {
                json["padding"] = it.toModel()
            }
            this.borderLeftWidth?.also {
                json["borderLeftWidth"] = it
            }
            this.borderRightWidth?.also {
                json["borderRightWidth"] = it
            }
            this.borderTopWidth?.also {
                json["borderTopWidth"] = it
            }
            this.borderBottomWidth?.also {
                json["borderBottomWidth"] = it
            }
            this.borderStartWidth?.also {
                json["borderStartWidth"] = it
            }
            this.borderEndWidth?.also {
                json["borderEndWidth"] = it
            }
            this.borderWidth?.also {
                json["borderWidth"] = it
            }
            this.left?.also {
                json["left"] = it.toModel()
            }
            this.right?.also {
                json["right"] = it.toModel()
            }
            this.top?.also {
                json["top"] = it.toModel()
            }
            this.bottom?.also {
                json["bottom"] = it.toModel()
            }
            this.start?.also {
                json["start"] = it.toModel()
            }
            this.end?.also {
                json["end"] = it.toModel()
            }
            this.width?.also {
                json["width"] = it.toModel()
            }
            this.height?.also {
                json["height"] = it.toModel()
            }
            this.minWidth?.also {
                json["minWidth"] = it.toModel()
            }
            this.minHeight?.also {
                json["minHeight"] = it.toModel()
            }
            this.maxWidth?.also {
                json["maxWidth"] = it.toModel()
            }
            this.maxHeight?.also {
                json["maxHeight"] = it.toModel()
            }
            this.aspectRatio?.also {
                json["aspectRatio"] = it
            }
        }
    }
}

enum class FontStyle(val value: String) : Modeling {
    Normal("normal"),
    Bold("bold"),
    Italic("italic"),
    BoldItalic("bold_italic");

    override fun toModel(): String {
        return this.value
    }
}

enum class ValueType(private val value: Int) : Modeling {
    Undefined(0),
    Point(1),
    Percent(2),
    Auto(3);

    override fun toModel(): Number {
        return this.value
    }
}
