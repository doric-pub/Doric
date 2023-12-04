import { Gravity } from 'doric';
import { Alignment } from './sandbox';

export function gravityToAlignment(gravity: number) {
  if ((gravity & Gravity.Top.val) === Gravity.Top.val) {
    if ((gravity & Gravity.Left.val) === Gravity.Center.val) {
      return Alignment.TopStart;
    } else if ((gravity & Gravity.Right.val) === Gravity.Right.val) {
      return Alignment.TopEnd;
    } else {
      return Alignment.Top;
    }
  } else if ((gravity & Gravity.Bottom.val) === Gravity.Bottom.val) {
    if ((gravity & Gravity.Left.val) === Gravity.Center.val) {
      return Alignment.BottomStart;
    } else if ((gravity & Gravity.Right.val) === Gravity.Right.val) {
      return Alignment.BottomEnd;
    } else {
      return Alignment.Bottom;
    }
  } else {
    if ((gravity & Gravity.Left.val) === Gravity.Center.val) {
      return Alignment.Start;
    } else if ((gravity & Gravity.Right.val) === Gravity.Right.val) {
      return Alignment.End;
    } else {
      return Alignment.Center;
    }
  }
}