import { Root, Stack as DoricStack } from 'doric';
import { getGlobalObject } from '../lib/sandbox';
import { GroupNode } from '../lib/GroupNode';


const Stack = getGlobalObject("Stack");

export class StackNode extends GroupNode<DoricStack> {
  TAG = Stack;

  pop() {
    Stack.pop();
  }

  blend(v: Root) {
    Stack.create();
    Stack.width('100%');
    Stack.height(`100%`);
    this.commonConfig(v)
  }
}

export class RootNode extends StackNode {
}
