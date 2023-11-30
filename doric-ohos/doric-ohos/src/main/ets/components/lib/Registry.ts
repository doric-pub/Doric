import { ClassType, View } from 'doric'
import { DoricViewNode } from './DoricViewNode'
import { DoricContext, DoricPlugin } from './sandbox'

const pluginMetaInfo: Map<string, ClassType<DoricPlugin>> = new Map

const viewNodeMetaInfo: Map<string, ClassType<DoricViewNode<any>>> = new Map

export function registerDoricPlugin(name: string, pluginClz: ClassType<DoricPlugin>) {
  pluginMetaInfo.set(name, pluginClz)
}

export function registerDoricViewNode(name: string, pluginClz: ClassType<DoricViewNode<any>>) {
  viewNodeMetaInfo.set(name, pluginClz)
}

export function createDoricViewNode<T extends View>(context: DoricContext, t: T): DoricViewNode<T> {
  const viewNodeClz = viewNodeMetaInfo.get(t.viewType());
  if (!viewNodeClz) {
    throw `Cannot find view node for ${t.viewType()}}`
  }
  return new viewNodeClz(context, t)
}

export function createDoricPlugin(context: DoricContext, namespace: string) {
  const pluginClz = pluginMetaInfo.get(namespace);
  if (!pluginClz) {
    throw (`Plugin ${namespace} is not implemented`)
  }
  return new pluginClz(context);
}
