import { Text as DoricText } from 'doric';
import { Text } from './sandbox';
import { DoricViewNode } from './DoricViewNode';

declare const Alignment: any;

export class TextNode extends DoricViewNode<DoricText> {
  pushing(v: DoricText) {
  }

  pop() {
    Text.pop();
  }

  blend(v: DoricText) {
    Text.create(v.text);
    Text.fontSize("20fp");
    Text.fontColor("#000000");
    Text.fontWeight(500);
    Text.align(Alignment.Center);
    Text.margin({
      top: 20
    });
    if (v.onClick) {
      Text.onClick(v.onClick);
    }
  }
}
