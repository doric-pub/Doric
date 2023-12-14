import { ListItem as DoricListItem } from 'doric'
import { GroupNode } from '../lib/GroupNode'
import { getGlobalObject } from '../lib/sandbox'

const ListItem = getGlobalObject("ListItem")
const Alignment = getGlobalObject("Alignment")

export class ListItemNode extends GroupNode<DoricListItem> {
  TAG = ListItem

  pop() {
    ListItem.pop()
  }

  blend(v: DoricListItem) {
    ListItem.create()
    ListItem.align(Alignment.TopStart)

    this.commonConfig(v)
  }
}