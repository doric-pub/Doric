import { Input } from 'doric'
import { getGlobalObject } from '../lib/sandbox'
import { DoricViewNode } from '../lib/DoricViewNode'

const TextInput = getGlobalObject("TextInput")

export class InputNode extends DoricViewNode<Input> {
  TAG = TextInput

  pushing(v: Input) {
  }

  pop() {
    TextInput.pop()
  }

  blend(v: Input) {
    TextInput.create({ text: v.text??"", placeholder: v.hintText??"" })

    if (v.hintTextColor) {
      TextInput.placeholderColor(v.hintTextColor.toModel())
    }

    if (v.onFocusChange) {
      TextInput.onFocus(() => {
        v.onFocusChange(true)
      })
      TextInput.onBlur(() => {
        v.onFocusChange(false)
      })
    }

    if (v.onTextChange) {
      TextInput.onChange(v.onTextChange)
    }

    // commonConfig
    this.commonConfig(v)
  }
}
