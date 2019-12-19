import { DoricPluginClass } from "./DoricPlugin"
import { ShaderPlugin } from "./plugins/ShaderPlugin"


const bundles: Map<string, string> = new Map

const plugins: Map<string, DoricPluginClass> = new Map

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

registerPlugin('shader', ShaderPlugin)
