import { Superview, View } from 'doric'
import { DoricViewNode } from './DoricViewNode'

export abstract class SuperNode<T extends Superview> extends DoricViewNode<T> {
  childNodes: Map<string, DoricViewNode<View>> = new Map

  getSubNodeById(id: string) {
    return this.childNodes.get(id)
  }

  pushing(v: T) {
    this.blendSubNodes(v)
  }

  isSelfDirty() {
    return Object.keys(this.view.dirtyProps).filter(e => e !== "subviews").length > 0
  }

  abstract blendSubNodes(v: T)
}