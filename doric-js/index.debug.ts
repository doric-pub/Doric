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
import { Panel } from './src/ui/panel';

type MSG = {
  type: "D2C" | "C2D" | "C2S" | "D2S" | "S2C" | "S2D",
  cmd: string,
  payload: { [index: string]: string | number | { type: number, value: string }[] }
}

let contextId: string | undefined = undefined;

let global = new Function('return this')()
const originSetTimeout = global.setTimeout
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
          case "":
            const { name, content } = payload as {
              name: string,
              content: string
            }
            Reflect.apply(
              doric.jsRegisterModule,
              undefined,
              [
                name,
                Reflect.apply((function (__module: { exports: object }) {
                  eval(`(function (module, exports, require) {
                    ${content}
                  })(__module, __module.exports, doric.__require__)`)
                  return __module.exports
                }), undefined, [{ exports: {} }])
              ]);
            break;
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
            if (payload.name === "Environment") {
              (arg as any).debugging = true
            }
            Reflect.set(global, payload.name as string, arg)
            break
          case "injectGlobalJSFunction":
            console.log("injectGlobalJSFunction", payload);
            if (payload.name === "nativeEmpty") {
              break
            }
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
            const callId = payload.callId;
            console.log("invokeMethod", callId, payload)
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
            console.log("Result", callId, result)
            ws.send(JSON.stringify({
              type: "D2C",
              cmd: 'invokeMethod',
              payload: {
                result,
                callId,
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

global.context = doric.jsObtainContext("FakeContext");
const entryHooks: Function[] = []
global.Entry = function () {
  if (!!contextId) {
    return Reflect.apply(doric.jsObtainEntry(contextId), doric, arguments);
  } else {
    const jsFile = new Error().stack?.split("\n")
      .map(e => e.match(/at\s__decorate.*?\s\((.*?)\)/))
      .find(e => !!e)?.[1].match(/(.*?\.js)/)?.[1];
    if (!jsFile) {
      throw new Error("Cannot find debugging file");
    }
    const args = arguments
    entryHooks.push((contextId: string) => {
      Reflect.apply(doric.jsObtainEntry(contextId), doric, args);
    })
    if (entryHooks.length <= 1) {
      const source = path.basename(jsFile)
      console.log(`Debugging ${source}`)
      initNativeEnvironment(source).then(ret => {
        contextId = ret;
        console.log("debugging context id: " + contextId);
        const realContext = doric.jsObtainContext(contextId);
        global.context.id = contextId;
        global.context = realContext;
        entryHooks.forEach(e => e(contextId))
      });
      return arguments[0];
    }
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

global.nativeRequire = () => {
  console.error("nativeRequire", new Error().stack);
  console.error("Do not call here in debugging");
  return false;
}

global.nativeBridge = () => {
  console.error("nativeBridge", new Error().stack);
  console.error("Do not call here in debugging");
  return false;
}

global.Environment = new Proxy({}, {
  get: (target, p, receiver) => {
    console.error("Environment Getter", new Error().stack);
    console.error("Do not call here in debugging");
    return undefined
  },
  set: (target, p, v, receiver) => {
    console.error("Environment Setter", new Error().stack)
    console.error("Do not call here in debugging");
    return Reflect.set(target, p, v, receiver);
  }
})

global.nativeEmpty = () => {
  originSetTimeout(() => {
    for (let context of doric.allContexts()) {
      const entity = context.entity
      if (entity instanceof Panel) {
        const panel = entity as Panel
        if (panel.getRootView().isDirty()) {
          const model = panel.getRootView().toModel()
          context.callNative("shader", "render", model)
          panel.getRootView().clean()
        }
        for (let map of panel.allHeadViews()) {
          for (let v of map.values()) {
            if (v.isDirty()) {
              const model = v.toModel()
              context.callNative("shader", "render", model)
              v.clean()
            }
          }
        }
      }
    }

  }, 0)
}

export * from './index'