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

const componentToHex = (c) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export const argbToHex = (a, r, g, b) => {
  return "#" + componentToHex(a) + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function parseInspectorRect(rect: string) {
  const leftTopPart = rect.substring(rect.indexOf("[") + 1, rect.indexOf("]"))
  const rightBottomPart = rect.substring(rect.indexOf("]") + 2, rect.length - 1)

  const leftTopArray = leftTopPart.split(",")
  const left = parseFloat(leftTopArray[0])
  const top = parseFloat(leftTopArray[1])

  const rightBottomArray = rightBottomPart.split(",")
  const right = parseFloat(rightBottomArray[0])
  const bottom = parseFloat(rightBottomArray[1])

  return {
    left: left,
    top: top,
    right: right,
    bottom: bottom
  }
}