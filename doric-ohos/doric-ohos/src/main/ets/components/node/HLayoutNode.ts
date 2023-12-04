import { HLayout, Gravity } from 'doric';
import { getGlobalObject } from '../lib/sandbox';
import { GroupNode } from '../lib/GroupNode';

const Row = getGlobalObject("Row");
const VerticalAlign = getGlobalObject("VerticalAlign");
const FlexAlign = getGlobalObject("FlexAlign");

export class HLayoutNode extends GroupNode<HLayout> {
  TAG = Row;

  pop() {
    Row.pop();
  }

  blend(v: HLayout) {
    Row.create({ space: v.space });

    // gravity
    const gravity = (v.gravity??Gravity.Left.top()).toModel();

    let flexAlign = FlexAlign.Start
    let verticalAlign = VerticalAlign.Top

    if ((gravity & Gravity.Top.val) === Gravity.Top.val) {
      verticalAlign = VerticalAlign.Top
    } else if ((gravity & Gravity.Bottom.val) === Gravity.Bottom.val) {
      verticalAlign = VerticalAlign.Bottom
    } else if ((gravity & Gravity.CenterY.val) === Gravity.CenterY.val) {
      verticalAlign = VerticalAlign.Center
    }
    if ((gravity & Gravity.Left.val) === Gravity.Left.val) {
      flexAlign = FlexAlign.Start
    } else if ((gravity & Gravity.Right.val) === Gravity.Right.val) {
      flexAlign = FlexAlign.End
    } else if ((gravity & Gravity.CenterX.val) === Gravity.CenterX.val) {
      flexAlign = FlexAlign.Center
    }
    Row.justifyContent(flexAlign)
    Row.alignItems(verticalAlign)

    // padding
    if (v.padding) {
      Row.padding(v.padding);
    }

    // commonConfig
    this.commonConfig(v)
  }
}
