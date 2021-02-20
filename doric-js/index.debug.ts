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
import WebSocket from "ws"
import path from 'path'

type MSG = {
  type: "D2C" | "C2D" | "C2S" | "D2S" | "S2C" | "S2D",
  cmd: string,
  payload: { [index: string]: string | number | { type: number, value: string }[] }
}

let contextId: string | undefined = undefined;

let global = new Function('return this')()
global.setTimeout = global.doricSetTimeout
global.setInterval = global.doricSetInterval
global.clearTimeout = global.doricClearTimeout
global.clearInterval = global.doricClearInterval
global.doric = doric


async function initNativeEnvironment(source: string) {
  // dev kit client
  return new Promise<string>((resolve, reject) => {
    const ws = new WebSocket('ws://localhost:7777')
      .on('open', () => {
        console.log('Connectted Devkit on port', '7777')
        ws.send(JSON.stringify({
          type: "D2C",
          cmd: "DEBUG_REQ",
          payload: {
            source,
          },
        } as MSG))
      })
      .on('message', (data) => {
        const msg = JSON.parse(data as string) as MSG
        const payload = msg.payload
        switch (msg.cmd) {
          case "DEBUG_RES":
            const contextId = msg.payload.contextId as string;
            resolve(contextId);
            break;
          case "injectGlobalJSObject":
            console.log("injectGlobalJSObject", payload);
            const type = payload.type as number
            const value = payload.value as string
            let arg
            if (type === 0) {
              arg = null
            } else if (type === 1) {
              arg = parseFloat(value)
            } else if (type === 2) {
              arg = (value == 'true')
            } else if (type === 3) {
              arg = value.toString()
            } else if (type === 4) {
              arg = JSON.parse(value)
            } else if (type === 5) {
              arg = JSON.parse(value)
            }
            Reflect.set(global, payload.name as string, arg)
            break
          case "injectGlobalJSFunction":
            console.log("injectGlobalJSFunction", payload);
            Reflect.set(global, payload.name as string, function () {
              let args = [].slice.call(arguments)
              console.log(args)
              console.log("injected", payload.name, args)
              ws.send(JSON.stringify({
                type: "D2C",
                cmd: 'injectGlobalJSFunction',
                payload: {
                  name: payload.name,
                  arguments: args
                }
              } as MSG))
            })
            break
          case "invokeMethod":
            console.log("invokeMethod", payload)
            const values = payload.values as { type: number, value: string }[]
            let args = []
            for (let i = 0; i < values.length; i++) {
              let value = values[i]
              if (value.type === 0) {
                args.push(null)
              } else if (value.type === 1) {
                args.push(parseFloat(value.value))
              } else if (value.type === 2) {
                args.push((value.value == 'true'))
              } else if (value.type === 3) {
                args.push(value.value.toString())
              } else if (value.type === 4) {
                args.push(JSON.parse(value.value))
              } else if (value.type === 5) {
                args.push(JSON.parse(value.value))
              }
            }
            const object = Reflect.get(global, payload.objectName as string)
            const method = Reflect.get(object, payload.functionName as string)
            const result = Reflect.apply(method, undefined, args)
            console.log(result)
            ws.send(JSON.stringify({
              type: "D2C",
              cmd: 'invokeMethod',
              payload: {
                result
              }
            } as MSG))
            break;
          case "DEBUG_STOP":
            console.log(msg.payload?.msg || "Stop debugging");
            process.exit(0);
            break;
        }
      })
      .on('error', (error) => {
        console.log(error)
        reject(error)
      })
  })
}


global.Entry = function () {
  if (!!contextId) {
    return Reflect.apply(doric.jsObtainEntry(contextId), doric, arguments);
  } else {
    const jsFile = new Error().stack?.split("\n")
      .map(e => e.match(/at\s__decorate\s\((.*?)\)/))
      .find(e => !!e)?.[1].match(/(.*?\.js)/)?.[1];
    if (!jsFile) {
      throw new Error("Cannot find debugging file");
    }
    const source = path.basename(jsFile)
    const args = arguments
    console.log(`Debugging ${source}`)
    initNativeEnvironment(source).then(ret => {
      contextId = ret;
      console.log("debugging context id: " + contextId);
      global.context = doric.jsObtainContext(contextId);
      Reflect.apply(doric.jsObtainEntry(contextId), doric, args);
    });
    return arguments[0];
  }
}

global.injectGlobal = (objName: string, obj: string) => {
  Reflect.set(global, objName, JSON.parse(obj))
}

global.sendToNative = () => {

}
global.receiveFromNative = () => {

}
global.nativeLog = (type: string, msg: string) => {
  switch (type) {
    case "w": {
      console.warn(msg);
      break;
    }
    case "e": {
      console.error(msg);
      break;
    }
    default: {
      console.log(msg);
      break;
    }
  }
}

export * from './index'