import { registerDoricPlugin, registerDoricViewNode } from './Registry'
import { RootNode, StackNode } from '../node/StackNode'
import { ShaderPlugin } from '../plugin/ShaderPlugin'
import { PopoverPlugin } from '../plugin/PopoverPlugin'
import { TextNode } from '../node/TextNode'
import { VLayoutNode } from '../node/VLayoutNode'
import { HLayoutNode } from '../node/HLayoutNode'
import { ImageNode } from '../node/ImageNode'
import { ScrollerNode } from '../node/ScrollerNode'
import { InputNode } from '../node/InputNode'
import { SwitchNode } from '../node/SwitchNode'
import { FlexLayoutNode } from '../node/FlexLayoutNode'
import { ListNode } from '../node/ListNode'
import { ListItemNode } from '../node/ListItemNode'
import { ModalPlugin } from '../plugin/ModalPlugin'
import { SlideItemNode } from '../node/SlideItemNode'
import { SliderNode } from '../node/SliderNode'
import { FlowLayoutItemNode } from '../node/FlowLayoutItemNode'
import { FlowLayoutNode } from '../node/FlowLayoutNode'
import { HorizontalListNode } from '../node/HorizontalListNode'
import { HorizontalListItemNode } from '../node/HorizontalListItemNode'

function injectGlobalFunction() {
  globalThis.nativeLog = (type: string, log: any) => {
    switch (type) {
      case "d":
        console.debug(log)
        break
      case "e":
        console.error(log)
        break
      case "w":
        console.warn(log)
        break
      default:
        console.log(log)
        break
    }
  }
}

export function initDoric() {
  injectGlobalFunction()

  registerDoricPlugin("shader", ShaderPlugin)
  registerDoricPlugin("popover", PopoverPlugin)
  registerDoricPlugin("modal", ModalPlugin)

  registerDoricViewNode("Root", RootNode)
  registerDoricViewNode("Stack", StackNode)
  registerDoricViewNode("VLayout", VLayoutNode)
  registerDoricViewNode("HLayout", HLayoutNode)
  registerDoricViewNode("Scroller", ScrollerNode)
  registerDoricViewNode("Text", TextNode)
  registerDoricViewNode("Image", ImageNode)
  registerDoricViewNode("Input", InputNode)
  registerDoricViewNode("Switch", SwitchNode)
  registerDoricViewNode("FlexLayout", FlexLayoutNode)
  registerDoricViewNode("List", ListNode)
  registerDoricViewNode("ListItem", ListItemNode)
  registerDoricViewNode("HorizontalList", HorizontalListNode)
  registerDoricViewNode("HorizontalListItem", HorizontalListItemNode)
  registerDoricViewNode("Slider", SliderNode)
  registerDoricViewNode("SlideItem", SlideItemNode)
  registerDoricViewNode("FlowLayout", FlowLayoutNode)
  registerDoricViewNode("FlowLayoutItem", FlowLayoutItemNode)
}