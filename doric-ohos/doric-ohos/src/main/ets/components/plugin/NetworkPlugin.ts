import http from '@ohos.net.http'

import { DoricPlugin } from '../lib/sandbox'

export class NetworkPlugin extends DoricPlugin {
  request(props: any) {
    let method = "GET"
    switch (props.method) {
      case "get":
        method = "GET"
        break
      case "post":
        method = "POST"
        break
      case "put":
        method = "PUT"
        break
      case "delete":
        method = "DELETE"
        break
    }

    return new Promise((resolve, reject) => {
      http.createHttp().request(
        props.url,
        {
          method: method as any,
          header: props.headers ?? undefined,
          extraData: props.data ?? undefined,
          connectTimeout: props.timeout ?? undefined
        },
        (error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(data)
          }
        }
      )
    })
  }
}