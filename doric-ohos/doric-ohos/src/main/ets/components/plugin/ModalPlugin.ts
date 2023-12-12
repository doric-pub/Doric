import Prompt from '@system.prompt'
import { Gravity } from 'doric'
import display from '@ohos.display'

import { DoricPlugin } from '../lib/sandbox'

export class ModalPlugin extends DoricPlugin {
  toast(props: any) {
    return new Promise((resolve, reject) => {
      const gravity = props.gravity

      const displaySync = display.getDefaultDisplaySync()
      if ((gravity & Gravity.Top.val) === Gravity.Top.val) {
      } else if ((gravity & Gravity.Bottom.val) === Gravity.Bottom.val) {
      } else if ((gravity & Gravity.CenterY.val) === Gravity.CenterY.val) {
      }

      Prompt.showToast({
        message: props.msg,
      })

      resolve("")
    })
  }

  alert(props: any) {
    return new Promise((resolve, reject) => {
      Prompt.showDialog({
        message: props.msg,
        title: props.title,
        buttons: [{
          text: props.okLabel,
          color: "#666666"
        }],
        success: function (data) {
          resolve(data)
        },
      })
    })
  }

  confirm(props: any) {
    return new Promise((resolve, reject) => {
      Prompt.showDialog({
        message: props.msg,
        title: props.title,
        buttons: [{
          text: props.okLabel,
          color: "#33dd44"
        }, {
          text: props.cancelLabel,
          color: "#33dd44"
        }],
        success: function (data) {
          resolve(data)
        },
        cancel: function (data: string, code: string) {
          reject(data)
        },
      })
    })
  }
}