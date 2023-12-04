import { registerDoricPlugin, registerDoricViewNode } from './Registry'
import { RootNode, StackNode } from '../node/StackNode'
import { ShaderPlugin } from '../plugin/ShaderPlugin'
import { TextNode } from '../node/TextNode'
import { VLayoutNode } from '../node/VLayoutNode'
import { HLayoutNode } from '../node/HLayoutNode'
import { ImageNode } from '../node/ImageNode'
import { ScrollerNode } from '../node/ScrollerNode'

export function initDoric() {
  registerDoricPlugin("shader", ShaderPlugin)
  registerDoricViewNode("Root", RootNode)
  registerDoricViewNode("Stack", StackNode)
  registerDoricViewNode("VLayout", VLayoutNode)
  registerDoricViewNode("HLayout", HLayoutNode)
  registerDoricViewNode("Scroller", ScrollerNode)
  registerDoricViewNode("Text", TextNode)
  registerDoricViewNode("Image", ImageNode)
}