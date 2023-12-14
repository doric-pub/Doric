import { FlowLayoutItem } from 'doric'
import { GroupNode } from '../lib/GroupNode'
import { getGlobalObject } from '../lib/sandbox'

const FlowItem = getGlobalObject("FlowItem")
const Alignment = getGlobalObject("Alignment")

export class FlowLayoutItemNode extends GroupNode<FlowLayoutItem> {
  TAG = FlowItem

  pop() {
    FlowItem.pop()
  }

  blend(v: FlowLayoutItem) {
    FlowItem.create()
    FlowItem.align(Alignment.TopStart)

    this.commonConfig(v)
  }
}