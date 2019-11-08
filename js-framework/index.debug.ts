/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as doric from './src/runtime/sandbox'
import * as WebSocket from 'ws'

let global = new Function('return this')()
global.doric = doric
const contextId = "1"
global.context = doric.jsObtainContext(contextId)
global.Entry = doric.jsObtainEntry(contextId)

const wss = new WebSocket.Server({ port: 2080 })
wss.on('connection', function connection(ws) {
  console.log('Connected')
  ws.on('message', function incoming(message: string) {
    let messageObject = JSON.parse(message)
    switch (messageObject.cmd) {
      case "injectGlobalJSFunction":
        console.log(messageObject.name)
        Reflect.set(global, messageObject.name, function () {
          let args = [].slice.call(arguments)
          console.log("===============================")
          console.log(args)
          console.log("===============================")
          ws.send(JSON.stringify({
            cmd: 'injectGlobalJSFunction',
            name: messageObject.name,
            arguments: args
          }))
        })
        break
      case "invokeMethod":
        console.log(messageObject.objectName)
        console.log(messageObject.functionName)

        let args = []
        for (let i = 0; i < messageObject.javaValues.length; i++) {
          let javaValue = messageObject.javaValues[i]
          if (javaValue.type === 0) {
            args.push(null)
          } else if (javaValue.type === 1) {
            args.push(parseFloat(javaValue.value))
          } else if (javaValue.type === 2) {
            args.push((javaValue.value == 'true'))
          } else if (javaValue.type === 3) {
            args.push(javaValue.value.toString())
          } else if (javaValue.type === 4) {
            args.push(JSON.parse(javaValue.value))
          } else if (javaValue.type === 5) {
            args.push(JSON.parse(javaValue.value))
          }
        }
        console.log(args)
        console.log(messageObject.hashKey)

        let object = Reflect.get(global, messageObject.objectName)
        let method = Reflect.get(object, messageObject.functionName)
        let result = Reflect.apply(method, undefined, args)

        console.log(result)
        ws.send(JSON.stringify({
          cmd: 'invokeMethod',
          result: result
        }))
        break
    }
  })
})
console.log('Start Server')

global.injectGlobal = (objName: string, obj: string) => {
  Reflect.set(global, objName, JSON.parse(obj))
}

global.sendToNative = () => {

}
global.receiveFromNative = () => {

}

export * from './index'