import { Color, Text as DoricText, Gravity } from 'doric'
import { Alignment, getGlobalObject } from '../lib/sandbox'
import { DoricViewNode } from '../lib/DoricViewNode'

const Text = getGlobalObject("Text")
const RichText = getGlobalObject("RichText")
const TextAlign = getGlobalObject("TextAlign")
const FontStyle = getGlobalObject("FontStyle")
const FontWeight = getGlobalObject("FontWeight")

export class TextNode extends DoricViewNode<DoricText> {
  TAG = Text

  pushing(v: DoricText) {
  }

  pop() {
    if (this.view.htmlText) {
      RichText.pop()
    } else {
      Text.pop()
    }
  }

  blend(v: DoricText) {
    if (v.htmlText) {
      RichText.create(v.htmlText)
    } else {
      // text
      Text.create(v.text??"")

      // textAlignment
      const textAlignment = (v.textAlignment??Gravity.Center).toModel()
      if ((textAlignment & Gravity.Top.val) === Gravity.Top.val) {
        //top
        Text.align(Alignment.Top)
      } else if ((textAlignment & Gravity.Bottom.val) === Gravity.Bottom.val) {
        //bottom
        Text.align(Alignment.Bottom)
      } else {
        Text.align(Alignment.Center)
      }
      if ((textAlignment & Gravity.Left.val) === Gravity.Left.val) {
        //left
        Text.textAlign(TextAlign.Start)
      } else if ((textAlignment & Gravity.Right.val) === Gravity.Right.val) {
        //right
        Text.textAlign(TextAlign.End)
      } else {
        Text.textAlign(TextAlign.Center)
      }

      // textSize
      if (v.textSize) {
        Text.fontSize(v.textSize)
      }

      // textColor
      if (v.textColor instanceof Color) {
        Text.fontColor(v.textColor.toModel())
      }

      // maxLines
      if (v.maxLines) {
        Text.maxLines(v.maxLines)
      }

      // fontStyle
      if (v.fontStyle) {
        switch (v.fontStyle) {
          case "normal":
            Text.fontStyle(FontStyle.Normal)
            Text.fontWeight(FontWeight.Normal)
            break
          case "italic":
            Text.fontStyle(FontStyle.Italic)
            Text.fontWeight(FontWeight.Normal)
            break
          case "bold":
            Text.fontStyle(FontStyle.Normal)
            Text.fontWeight(FontWeight.Bold)
            break
          case "bold_italic":
            Text.fontStyle(FontStyle.Italic)
            Text.fontWeight(FontWeight.Bold)
            break
        }
      }

      // maxWidth & maxHeight
      Text.constraintSize({
        ...(v.maxWidth !== undefined ? { maxWidth: v.maxWidth } : {}),
        ...(v.maxHeight !== undefined ? { maxHeight: v.maxHeight } : {}),
      })
    }

    // commonConfig
    this.commonConfig(v)
  }
}
