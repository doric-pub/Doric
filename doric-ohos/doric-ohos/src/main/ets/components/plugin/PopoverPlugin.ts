import { NativeViewModel, View } from 'doric';
import { createDoricViewNode } from '../lib/Registry';
import { DoricPlugin, getGlobalObject, ViewStackProcessor } from '../lib/sandbox';

const ForEach = getGlobalObject("ForEach");

export class PopoverPlugin extends DoricPlugin {
  static TYPE = "popover"

  async show(props: NativeViewModel) {
    this.render()
  }

  async dismiss(props: NativeViewModel) {
    this.render()
  }

  private render() {
    const headviews = (this.context.entity as any).headviews as Map<string, Map<string, View>>
    const popoverHeadViews = headviews.get(PopoverPlugin.TYPE)

    if (popoverHeadViews !== undefined) {
      const view = Array.from(popoverHeadViews.values())
      this.context.popoverRootNode.view.children.splice(0, this.context.popoverRootNode.view.children.length)
      this.context.popoverRootNode.view.children.push(...view)
    } else {
      this.context.popoverRootNode.view.children.splice(0, this.context.popoverRootNode.view.children.length)
    }

    this.context.popoverRootNode.render()
  }
}