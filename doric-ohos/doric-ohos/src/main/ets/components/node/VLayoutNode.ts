import { VLayout, Gravity } from 'doric';
import { getGlobalObject } from '../lib/sandbox';
import { GroupNode } from '../lib/GroupNode';
import { gravityToAlignment } from '../lib/util';

const Column = getGlobalObject("Column");

export class VLayoutNode extends GroupNode<VLayout> {
  TAG = Column;

  pop() {
    Column.pop();
  }

  blend(v: VLayout) {
    Column.create(v.space);

    const gravity = (v.gravity??Gravity.Center).toModel();
    Column.align(gravityToAlignment(gravity));
    if (v.padding) {
      Column.padding(v.padding);
    }
    this.commonConfig(v)
  }
}
