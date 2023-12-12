import { Color, InputType as DoricInputType, Gravity, Input, LayoutSpec, ReturnKeyType } from 'doric'
import { Alignment, getGlobalObject, ViewStackProcessor } from '../lib/sandbox'
import { DoricViewNode } from '../lib/DoricViewNode'

const Stack = getGlobalObject("Stack")
const TextInput = getGlobalObject("TextInput")
const TextArea = getGlobalObject("TextArea")
const Visibility = getGlobalObject("Visibility")
const InputType = getGlobalObject("InputType")
const TextAlign = getGlobalObject("TextAlign")
const FontStyle = getGlobalObject("FontStyle")
const FontWeight = getGlobalObject("FontWeight")
const EnterKeyType = getGlobalObject("EnterKeyType")

export class InputNode extends DoricViewNode<Input> {
  TAG = Stack

  textInputElmtId?: number
  textAreaElmtId?: number

  private value: any

  pushing(v: Input) {
    this.renderTextInput()
    this.renderTextArea()
  }

  pop() {
    Stack.pop()
  }

  blend(v: Input) {
    Stack.create()

    // commonConfig
    this.commonConfig(v)
  }

  private renderTextInput() {
    const firstRender = this.textInputElmtId === undefined
    if (firstRender) {
      this.textInputElmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent()
    }
    if (firstRender || this.isDirty()) {
      ViewStackProcessor.StartGetAccessRecordingFor(this.textInputElmtId)
      if (firstRender || this.isDirty()) {
        this.blendTextInput(this.view)
      }
      if (!firstRender) {
        this.popTextInput()
      }
      ViewStackProcessor.StopGetAccessRecording()
      if (!firstRender) {
        this.context.viewPU.finishUpdateFunc(this.textInputElmtId)
      }
    }
    if (firstRender) {
      this.popTextInput()
    }
  }

  private blendTextInput(v: Input) {
    this.commonBlend(v, TextInput)
  }

  private popTextInput() {
    TextInput.pop()
  }

  private renderTextArea() {
    const firstRender = this.textAreaElmtId === undefined
    if (firstRender) {
      this.textAreaElmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent()
    }
    if (firstRender || this.isDirty()) {
      ViewStackProcessor.StartGetAccessRecordingFor(this.textAreaElmtId)
      if (firstRender || this.isDirty()) {
        this.blendTextArea(this.view)
      }
      if (!firstRender) {
        this.popTextArea()
      }
      ViewStackProcessor.StopGetAccessRecording()
      if (!firstRender) {
        this.context.viewPU.finishUpdateFunc(this.textAreaElmtId)
      }
    }
    if (firstRender) {
      this.popTextArea()
    }
  }

  private blendTextArea(v: Input) {
    this.commonBlend(v, TextArea)
  }

  private popTextArea() {
    TextArea.pop()
  }

  private commonBlend(v: Input, tag: any) {
    // text & hintText
    tag.create({ text: v.text??"", placeholder: v.hintText??"" })

    // handle layout to adapt to stack container
    const widthSpec = v.layoutConfig?.widthSpec?? LayoutSpec.JUST
    const heightSpec = v.layoutConfig?.heightSpec?? LayoutSpec.JUST
    switch (widthSpec) {
      case LayoutSpec.FIT:
        break
      case LayoutSpec.MOST:
        tag.width("100%")
        break
      case LayoutSpec.JUST:
      default:
        tag.width(v.width)
        break
    }

    switch (heightSpec) {
      case LayoutSpec.MOST:
        tag.height("100%")
        break
      case LayoutSpec.FIT:
        break
      case LayoutSpec.JUST:
      default:
        tag.height(v.height)
        break
    }

    // textSize
    if (v.textSize) {
      tag.fontSize(v.textSize)
    }

    // textColor
    if (v.textColor instanceof Color) {
      tag.fontColor(v.textColor.toModel())
    }

    // multiline
    if (tag === TextArea) {
      tag.visibility(v.multiline ? Visibility.Visible : Visibility.None)
    } else if (tag === TextInput) {
      tag.visibility(v.multiline ? Visibility.None : Visibility.Visible)
    }

    // inputType
    if (tag === TextInput) {
      switch (v.inputType) {
        case DoricInputType.Default:
          tag.type(InputType.Normal)
          break
        case DoricInputType.Number:
          tag.type(InputType.Number)
          break
        case DoricInputType.Decimal:
          tag.type(InputType.Number)
          break
        case DoricInputType.Alphabet:
          tag.type(InputType.Normal)
          break
        case DoricInputType.Phone:
          tag.type(InputType.PhoneNumber)
          break
        default:
          tag.type(InputType.Normal)
          break
      }
    }

    // hintTextColor
    if (v.hintTextColor) {
      tag.placeholderColor(v.hintTextColor.toModel())
    }

    // textAlignment
    const textAlignment = (v.textAlignment??Gravity.Left.centerY()).toModel()
    if ((textAlignment & Gravity.Top.val) === Gravity.Top.val) {
      //top
      tag.align(Alignment.Top)
    } else if ((textAlignment & Gravity.Bottom.val) === Gravity.Bottom.val) {
      //bottom
      tag.align(Alignment.Bottom)
    } else {
      tag.align(Alignment.Center)
    }
    if ((textAlignment & Gravity.Left.val) === Gravity.Left.val) {
      //left
      tag.textAlign(TextAlign.Start)
    } else if ((textAlignment & Gravity.Right.val) === Gravity.Right.val) {
      //right
      tag.textAlign(TextAlign.End)
    } else {
      tag.textAlign(TextAlign.Center)
    }

    if (v.fontStyle) {
      switch (v.fontStyle) {
        case "normal":
          tag.fontStyle(FontStyle.Normal)
          tag.fontWeight(FontWeight.Normal)
          break
        case "italic":
          tag.fontStyle(FontStyle.Italic)
          tag.fontWeight(FontWeight.Normal)
          break
        case "bold":
          tag.fontStyle(FontStyle.Normal)
          tag.fontWeight(FontWeight.Bold)
          break
        case "bold_italic":
          tag.fontStyle(FontStyle.Italic)
          tag.fontWeight(FontWeight.Bold)
          break
      }
    }

    // onTextChange
    tag.onChange((value) => {
      this.value = value
      if (v.onTextChange) {
        v.onTextChange(value)
      }
    })

    // onFocusChange
    if (v.onFocusChange) {
      tag.onFocus(() => {
        v.onFocusChange(true)
      })
      tag.onBlur(() => {
        v.onFocusChange(false)
      })
    }

    // maxLength
    if (tag === TextInput) {
      if (v.maxLength) {
        tag.maxLength(v.maxLength)
      }
    }

    // password
    if (tag === TextInput) {
      if (v.password) {
        tag.type(InputType.Password)
      }
    }

    // returnKeyType
    if (tag === TextInput) {
      switch (v.returnKeyType) {
        case ReturnKeyType.Default:
          break
        case ReturnKeyType.Done:
          tag.enterKeyType(EnterKeyType.Done)
          break
        case ReturnKeyType.Search:
          tag.enterKeyType(EnterKeyType.Search)
          break
        case ReturnKeyType.Next:
          tag.enterKeyType(EnterKeyType.Next)
          break
        case ReturnKeyType.Go:
          tag.enterKeyType(EnterKeyType.Go)
          break
        case ReturnKeyType.Send:
          tag.enterKeyType(EnterKeyType.Send)
          break
        default:
          break
      }
    }

    // onSubmitEditing
    if (tag === TextInput) {
      if (v.onSubmitEditing) {
        tag.onSubmit(() => {
          v.onSubmitEditing(this.value)
        })
      }
    }
  }

  private getText() {
    return new Promise((resolve, reject) => {
      resolve(this.value)
    })
  }
}
