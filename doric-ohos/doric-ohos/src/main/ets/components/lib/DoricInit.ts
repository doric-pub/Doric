import { registerDoricPlugin, registerDoricViewNode } from './Registry'
import { RootNode, StackNode } from '../node/StackNode'
import { ShaderPlugin } from '../plugin/ShaderPlugin'
import { TextNode } from '../node/TextNode'
import { VLayoutNode } from '../node/VLayoutNode'
import { HLayoutNode } from '../node/HLayoutNode'
import { ImageNode } from '../node/ImageNode'
import { ScrollerNode } from '../node/ScrollerNode'
import { InputNode } from '../node/InputNode'
import { SwitchNode } from '../node/SwitchNode'
import { FlexLayoutNode } from '../node/FlexLayoutNode'

export function initDoric() {
  registerDoricPlugin("shader", ShaderPlugin)

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
}