import { VLayout, } from 'doric';
import { getGlobalObject } from '../lib/sandbox';
import { GroupNode } from '../lib/GroupNode';

const Column = getGlobalObject("Column");

export class VLayoutNode extends GroupNode<VLayout> {
  TAG = Column;

  pop() {
    Column.pop();
  }

  blend(v: VLayout) {
    Column.create();
    Column.width('100%');
    Column.height(`50%`);
    Column.padding({ top: 100 });
    this.commonConfig(v)
  }
}
