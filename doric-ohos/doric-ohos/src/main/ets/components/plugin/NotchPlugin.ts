import http from '@ohos.net.http'
import display from '@ohos.display'

import { DoricPlugin } from '../lib/sandbox'

export class NotchPlugin extends DoricPlugin {
  inset(props: any) {
    return new Promise((resolve, reject) => {
      display.getDefaultDisplaySync().getCutoutInfo()
        .then((cutoutInfo) => {
          console.log("")
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}