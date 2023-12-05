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
    TextInput.create()

    // commonConfig
    this.commonConfig(v)
  }
}
