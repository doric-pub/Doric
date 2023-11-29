
import { registerDoricPlugin } from './sandbox'
import { ShaderPlugin } from './ShaderPlugin'

export function initDoric(){
  registerDoricPlugin("shader",ShaderPlugin)
}