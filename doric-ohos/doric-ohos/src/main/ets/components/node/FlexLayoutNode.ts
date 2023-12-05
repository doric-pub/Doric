import { Gravity, FlexLayout } from 'doric';
import { getGlobalObject } from '../lib/sandbox';
import { GroupNode } from '../lib/GroupNode';

const Flex = getGlobalObject("Flex");
const VerticalAlign = getGlobalObject("VerticalAlign");
const FlexAlign = getGlobalObject("FlexAlign");

export class FlexLayoutNode extends GroupNode<FlexLayout> {
  TAG = Flex;

  pop() {
    Flex.pop();
  }

  blend(v: FlexLayout) {
    if (v.flexConfig) {
      Flex.create();
    }

    // commonConfig
    this.commonConfig(v)
  }
}
