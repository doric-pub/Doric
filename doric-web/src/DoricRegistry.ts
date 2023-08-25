import { DoricPluginClass } from "./DoricPlugin"
import { ShaderPlugin } from "./plugins/ShaderPlugin"
import { DoricViewNodeClass } from "./shader/DoricViewNode"
import { DoricStackNode } from "./shader/DoricStackNode"
import { DoricVLayoutNode } from './shader/DoricVLayoutNode'
import { DoricHLayoutNode } from './shader/DoricHLayoutNode'
import { DoricTextNode } from "./shader/DoricTextNode"
import { DoricImageNode } from "./shader/DoricImageNode"
import { DoricScrollerNode } from "./shader/DoricScrollerNode"
import { ModalPlugin } from './plugins/ModalPlugin'
import { StoragePlugin } from "./plugins/StoragePlugin"
import { NavigatorPlugin } from "./navigate/NavigatorPlugin"
import { PopoverPlugin } from './plugins/PopoverPlugin'
import { DoricListItemNode } from "./shader/DoricListItemNode"
import { DoricListNode } from "./shader/DoricListNode"
import { DoricDraggableNode } from "./shader/DoricDraggableNode"
import { DoricRefreshableNode } from "./shader/DoricRefreshableNode"
import { AnimatePlugin } from "./plugins/AnimatePlugin"
import { DoricSwitchNode } from "./shader/DoricSwitchNode"
import { DoricSliderNode } from "./shader/DoricSliderNode"
import { DoricSlideItemNode } from "./shader/DoricSlideItemNode"
import { NotificationPlugin } from "./plugins/NotificationPlugin"
import { NetworkPlugin } from "./plugins/NetworkPlugin"
import { DoricNestedSliderNode } from "./shader/DoricNestedSliderNode"

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
registerPlugin('modal', ModalPlugin)
registerPlugin('storage', StoragePlugin)
registerPlugin('navigator', NavigatorPlugin)
registerPlugin('popover', PopoverPlugin)
registerPlugin('animate', AnimatePlugin)
registerPlugin('notification', NotificationPlugin)
registerPlugin('network', NetworkPlugin)

registerViewNode('Stack', DoricStackNode)
registerViewNode('VLayout', DoricVLayoutNode)
registerViewNode('HLayout', DoricHLayoutNode)
registerViewNode('Text', DoricTextNode)
registerViewNode('Image', DoricImageNode)
registerViewNode('Scroller', DoricScrollerNode)
registerViewNode('ListItem', DoricListItemNode)
registerViewNode('List', DoricListNode)
registerViewNode('Draggable', DoricDraggableNode)
registerViewNode('Refreshable', DoricRefreshableNode)
registerViewNode('Switch', DoricSwitchNode)
registerViewNode('Slider', DoricSliderNode)
registerViewNode('SlideItem', DoricSlideItemNode)
registerViewNode('NestedSlider', DoricNestedSliderNode)