import { registerDoricPlugin, registerDoricViewNode } from './Registry'
import { RootNode, StackNode } from '../node/StackNode'
import { ShaderPlugin } from '../plugin/ShaderPlugin'
import { TextNode } from '../node/TextNode'
import { VLayoutNode } from '../node/VLayoutNode'
import { ImageNode } from '../node/ImageNode'

export function initDoric() {
  registerDoricPlugin("shader", ShaderPlugin)
  registerDoricViewNode("Root", RootNode)
  registerDoricViewNode("VLayout", VLayoutNode)
  registerDoricViewNode("Text", TextNode)
  registerDoricViewNode("Stack", StackNode)
  registerDoricViewNode("Image", ImageNode)
}