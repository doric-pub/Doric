import { DoricPluginClass } from "./DoricPlugin"
import { ShaderPlugin } from "./plugins/ShaderPlugin"
import { DoricViewNodeClass } from "./shader/DoricViewNode"
import { DoricStackNode } from "./shader/DoricStackNode"
import { DoricVLayoutNode } from './shader/DoricVLayoutNode'
import { DoricHLayoutNode } from './shader/DoricHLayoutNode'

const bundles: Map<string, string> = new Map

const plugins: Map<string, DoricPluginClass> = new Map

const nodes: Map<string, DoricViewNodeClass> = new Map


export function acquireJSBundle(name: string) {
    return bundles.get(name)
}

export function registerJSBundle(name: string, bundle: string) {
    bundles.set(name, bundle)
}

export function registerPlugin(name: string, plugin: DoricPluginClass) {
    plugins.set(name, plugin)
}

export function acquirePlugin(name: string) {
    return plugins.get(name)
}

export function registerViewNode(name: string, node: DoricViewNodeClass) {
    nodes.set(name, node)
}

export function acquireViewNode(name: string) {
    return nodes.get(name)
}

registerPlugin('shader', ShaderPlugin)

registerViewNode('Stack', DoricStackNode)
registerViewNode('VLayout', DoricVLayoutNode)
registerViewNode('HLayout', DoricHLayoutNode)