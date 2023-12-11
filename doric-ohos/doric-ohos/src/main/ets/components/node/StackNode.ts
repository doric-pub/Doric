import { Root, Stack as DoricStack } from 'doric';
import { getGlobalObject } from '../lib/sandbox';
import { GroupNode } from '../lib/GroupNode';

const Stack = getGlobalObject("Stack");
const Alignment = getGlobalObject("Alignment");

export class StackNode extends GroupNode<DoricStack> {
  TAG = Stack;

  pop() {
    Stack.pop();
  }

  blend(v: Root) {
    Stack.create();
    Stack.alignContent(Alignment.TopStart)

    this.commonConfig(v)
  }
}

export class RootNode extends StackNode {
  blend(v: Root) {
    Stack.create();
    Stack.alignContent(Alignment.TopStart)

    console.log("RootNode",v.width,v.height)
    this.commonConfig(v)
  }
}

export class PopoverRootNode extends StackNode {

  blend(v: Root) {
    Stack.create();
    Stack.alignContent(Alignment.TopStart)

    if (this.view.children.length === 0) {
      this.view.hidden = true
    } else {
      this.view.hidden = false
    }

    this.commonConfig(v)
  }
}
