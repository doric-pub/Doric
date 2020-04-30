package doric.kotlin

import doric.widget.HLayout
import doric.widget.Stack
import doric.widget.VLayout
import doric.ui.Group
import doric.ui.View
import doric.widget.*


/**
 *
 * @Description:    DoricLayouts extensions
 * @Author:         pengfei.zhou
 * @CreateDate:     2020/4/29
 */
val Factory_VLayout = {
    val ret = VLayout()
    ret.layoutConfig = LayoutConfig().fit()
    ret
}

val Factory_HLayout = {
    val ret = HLayout()
    ret.layoutConfig = LayoutConfig().fit()
    ret
}

val Factory_Stack = {
    val ret = Stack()
    ret.layoutConfig = LayoutConfig().fit()
    ret
}

val Factory_FlexLayout = {
    val ret = FlexLayout()
    ret.layoutConfig = LayoutConfig().fit()
    ret
}

val Factory_Text = {
    val ret = Text()
    ret.layoutConfig = LayoutConfig().fit()
    ret
}

val Factory_Image = {
    val ret = Image()
    ret.layoutConfig = LayoutConfig().fit()
    ret
}


val Factory_Scroller = {
    val ret = Scroller()
    ret
}

val Factory_List = {
    val ret = List()
    ret
}

val Factory_ListItem = {
    val ret = ListItem()
    ret.layoutConfig = LayoutConfig()
    ret
}


val Factory_Slider = {
    val ret = Slider()
    ret
}

val Factory_SliderItem = {
    val ret = SlideItem()
    ret.layoutConfig = LayoutConfig().most()
    ret
}

val Factory_FlowLayout = {
    val ret = FlowLayout()
    ret
}

val Factory_FlowLayoutItem = {
    val ret = FlowLayoutItem()
    ret
}

val Factory_Input = {
    val ret = Input()
    ret
}

val Factory_Refreshable = {
    val ret = Refreshable()
    ret
}

val Factory_Switch = {
    val ret = Switch()
    ret
}

val Factory_Draggable = {
    val ret = Draggable()
    ret
}

inline fun <T : View> doricView(factory: () -> T, init: T.() -> Unit, parent: Group): T {
    val view = factory()
    view.init()
    parent.addChild(view)
    return view
}

inline fun Group.vlayout(function: VLayout.() -> Unit): VLayout {
    return doricView(Factory_VLayout, function, this)
}

inline fun Group.hlayout(function: HLayout.() -> Unit): HLayout {
    return doricView(Factory_HLayout, function, this)
}

inline fun Group.stack(function: Stack.() -> Unit): Stack {
    return doricView(Factory_Stack, function, this)
}

inline fun Group.flexlayout(function: FlexLayout.() -> Unit): FlexLayout {
    return doricView(Factory_FlexLayout, function, this)
}


inline fun Group.text(function: Text.() -> Unit): Text {
    return doricView(Factory_Text, function, this)
}

inline fun Group.image(function: Image.() -> Unit): Image {
    return doricView(Factory_Image, function, this)
}

inline fun Group.input(function: Input.() -> Unit): Input {
    return doricView(Factory_Input, function, this)
}

inline fun Group.scroller(function: Scroller.() -> Unit): Scroller {
    return doricView(Factory_Scroller, function, this)
}

inline fun Group.list(function: List.() -> Unit): List {
    return doricView(Factory_List, function, this)
}

inline fun Group.listItem(function: ListItem.() -> Unit): ListItem {
    return doricView(Factory_ListItem, function, this)
}

inline fun Group.flowlayout(function: FlowLayout.() -> Unit): FlowLayout {
    return doricView(Factory_FlowLayout, function, this)
}

inline fun Group.flowLayoutItem(function: FlowLayoutItem.() -> Unit): FlowLayoutItem {
    return doricView(Factory_FlowLayoutItem, function, this)
}

inline fun Group.slider(function: Slider.() -> Unit): Slider {
    return doricView(Factory_Slider, function, this)
}

inline fun Group.sliderItem(function: SlideItem.() -> Unit): SlideItem {
    return doricView(Factory_SliderItem, function, this)
}

inline fun Group.switch(function: Switch.() -> Unit): Switch {
    return doricView(Factory_Switch, function, this)
}

inline fun Group.draggable(function: Draggable.() -> Unit): Draggable {
    return doricView(Factory_Draggable, function, this)
}