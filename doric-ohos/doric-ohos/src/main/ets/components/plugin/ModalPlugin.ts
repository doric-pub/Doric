import Prompt from '@system.prompt'
import { Gravity } from 'doric'

import { DoricPlugin } from '../lib/sandbox'

export class ModalPlugin extends DoricPlugin {
  toast(props: any) {
    Prompt.showToast({
      message: props.msg,
    })
  }
}