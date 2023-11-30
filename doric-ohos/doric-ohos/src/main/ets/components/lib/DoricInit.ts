import { registerDoricPlugin, registerDoricViewNode } from './Registry'
import { RootNode } from './RootNode'
import { ShaderPlugin } from './ShaderPlugin'
import { TextNode } from './TextNode'
import { VLayoutNode } from './VLayoutNode'

export function initDoric() {
  registerDoricPlugin("shader", ShaderPlugin)
  registerDoricViewNode("Root", RootNode)
  registerDoricViewNode("VLayout", VLayoutNode)
  registerDoricViewNode("Text", TextNode)
}