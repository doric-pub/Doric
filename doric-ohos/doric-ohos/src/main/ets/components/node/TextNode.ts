import { Color, Gravity, Text as DoricText } from 'doric';
import { Alignment, getGlobalObject } from '../lib/sandbox';
import { DoricViewNode } from '../lib/DoricViewNode';

const Text = getGlobalObject("Text");

const TextAlign = getGlobalObject("TextAlign");

export class TextNode extends DoricViewNode<DoricText> {
  TAG = Text;

  pushing(v: DoricText) {
  }

  pop() {
    Text.pop();
  }

  blend(v: DoricText) {
    Text.create(v.text??"");
    const textAlignment = (v.textAlignment??Gravity.Center).toModel();
    if ((textAlignment & Gravity.Top.val) === Gravity.Top.val) {
      //top
      Text.align(Alignment.Top);
    } else if ((textAlignment & Gravity.Bottom.val) === Gravity.Bottom.val) {
      //bottom
      Text.align(Alignment.Bottom);
    } else {
      Text.align(Alignment.Center);
    }
    if ((textAlignment & Gravity.Left.val) === Gravity.Left.val) {
      //left
      Text.textAlign(TextAlign.Start);
    } else if ((textAlignment & Gravity.Right.val) === Gravity.Right.val) {
      //right
      Text.textAlign(TextAlign.End);
    } else {
      Text.textAlign(TextAlign.Center);
    }

    if (v.textSize) {
      Text.fontSize(v.textSize);
    }

    if (v.textColor instanceof Color) {
      Text.fontColor(v.textColor.toModel())
    }
    this.commonConfig(v)
  }
}
