import { ListItem } from 'doric';
import { getGlobalObject } from '../lib/sandbox';
import { StackNode } from './StackNode';

const Stack = getGlobalObject("Stack");
const Alignment = getGlobalObject("Alignment");

export class SlideItemNode extends StackNode {
  blend(v: ListItem) {
    Stack.create();
    Stack.alignContent(Alignment.TopStart)

    this.commonConfig(v)
  }
}