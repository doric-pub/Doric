import { HorizontalListItem } from 'doric'
import { GroupNode } from '../lib/GroupNode'
import { getGlobalObject } from '../lib/sandbox'

const ListItem = getGlobalObject("ListItem")
const Alignment = getGlobalObject("Alignment")

export class HorizontalListItemNode extends GroupNode<HorizontalListItem> {
  TAG = ListItem

  pop() {
    ListItem.pop()
  }

  blend(v: HorizontalListItem) {
    ListItem.create()
    ListItem.align(Alignment.TopStart)

    this.commonConfig(v)
  }
}