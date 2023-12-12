import { VLayout, Gravity } from 'doric';
import { getGlobalObject } from '../lib/sandbox';
import { GroupNode } from '../lib/GroupNode';
import { gravityToAlignment } from '../lib/util';

const Column = getGlobalObject("Column");
const HorizontalAlign = getGlobalObject("HorizontalAlign");
const FlexAlign = getGlobalObject("FlexAlign");

export class VLayoutNode extends GroupNode<VLayout> {
  TAG = Column;

  pop() {
    Column.pop();
  }

  blend(v: VLayout) {
    Column.create({ space: v.space });

    // gravity
    const gravity = (v.gravity??Gravity.Left.top()).toModel();

    let flexAlign = FlexAlign.Start
    let horizontalAlign = HorizontalAlign.Start
    if ((gravity & Gravity.Top.val) === Gravity.Top.val) {
      flexAlign = FlexAlign.Start
    } else if ((gravity & Gravity.Bottom.val) === Gravity.Bottom.val) {
      flexAlign = FlexAlign.End
    } else if ((gravity & Gravity.CenterY.val) === Gravity.CenterY.val) {
      flexAlign = FlexAlign.Center
    }
    if ((gravity & Gravity.Left.val) === Gravity.Left.val) {
      horizontalAlign = HorizontalAlign.Start
    } else if ((gravity & Gravity.Right.val) === Gravity.Right.val) {
      horizontalAlign = HorizontalAlign.End
    } else if ((gravity & Gravity.CenterX.val) === Gravity.CenterX.val) {
      horizontalAlign = HorizontalAlign.Center
    }
    Column.justifyContent(flexAlign)
    Column.alignItems(horizontalAlign)

    // padding
    if (v.padding) {
      Column.padding(v.padding);
    }

    // commonConfig
    this.commonConfig(v)
  }
}