var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import * as doric from './src/runtime/sandbox';
import WebSocket from "ws";
import path from 'path';
import { Panel } from './src/ui/panel';
let contextId = undefined;
let global = new Function('return this')();
const originSetTimeout = global.setTimeout;
global.setTimeout = global.doricSetTimeout;
global.setInterval = global.doricSetInterval;
global.clearTimeout = global.doricClearTimeout;
global.clearInterval = global.doricClearInterval;
global.doric = doric;
function initNativeEnvironment(source) {
    return __awaiter(this, void 0, void 0, function* () {
        // dev kit client
        return new Promise((resolve, reject) => {
            const ws = new WebSocket('ws://localhost:7777')
                .on('open', () => {
                console.log('Connectted Devkit on port', '7777');
                ws.send(JSON.stringify({
                    type: "D2C",
                    cmd: "DEBUG_REQ",
                    payload: {
                        source,
                    },
                }));
            })
                .on('message', (data) => {
                var _a;
                const msg = JSON.parse(data);
                const payload = msg.payload;
                switch (msg.cmd) {
                    case "DEBUG_RES":
                        const contextId = msg.payload.contextId;
                        resolve(contextId);
                        break;
                    case "injectGlobalJSObject":
                        console.log("injectGlobalJSObject", payload);
                        const type = payload.type;
                        const value = payload.value;
                        let arg;
                        if (type === 0) {
                            arg = null;
                        }
                        else if (type === 1) {
                            arg = parseFloat(value);
                        }
                        else if (type === 2) {
                            arg = (value == 'true');
                        }
                        else if (type === 3) {
                            arg = value.toString();
                        }
                        else if (type === 4) {
                            arg = JSON.parse(value);
                        }
                        else if (type === 5) {
                            arg = JSON.parse(value);
                        }
                        if (payload.name === "Environment") {
                            arg.debugging = true;
                        }
                        Reflect.set(global, payload.name, arg);
                        break;
                    case "injectGlobalJSFunction":
                        console.log("injectGlobalJSFunction", payload);
                        if (payload.name === "nativeEmpty") {
                            break;
                        }
                        Reflect.set(global, payload.name, function () {
                            let args = [].slice.call(arguments);
                            console.log(args);
                            console.log("injected", payload.name, args);
                            ws.send(JSON.stringify({
                                type: "D2C",
                                cmd: 'injectGlobalJSFunction',
                                payload: {
                                    name: payload.name,
                                    arguments: args
                                }
                            }));
                        });
                        break;
                    case "invokeMethod":
                        const callId = payload.callId;
                        console.log("invokeMethod", callId, payload);
                        const values = payload.values;
                        let args = [];
                        for (let i = 0; i < values.length; i++) {
                            let value = values[i];
                            if (value.type === 0) {
                                args.push(null);
                            }
                            else if (value.type === 1) {
                                args.push(parseFloat(value.value));
                            }
                            else if (value.type === 2) {
                                args.push((value.value == 'true'));
                            }
                            else if (value.type === 3) {
                                args.push(value.value.toString());
                            }
                            else if (value.type === 4) {
                                args.push(JSON.parse(value.value));
                            }
                            else if (value.type === 5) {
                                args.push(JSON.parse(value.value));
                            }
                        }
                        const object = Reflect.get(global, payload.objectName);
                        const method = Reflect.get(object, payload.functionName);
                        const result = Reflect.apply(method, undefined, args);
                        console.log("Result", callId, result);
                        ws.send(JSON.stringify({
                            type: "D2C",
                            cmd: 'invokeMethod',
                            payload: {
                                result,
                                callId,
                            }
                        }));
                        break;
                    case "DEBUG_STOP":
                        console.log(((_a = msg.payload) === null || _a === void 0 ? void 0 : _a.msg) || "Stop debugging");
                        process.exit(0);
                        break;
                }
            })
                .on('error', (error) => {
                console.log(error);
                reject(error);
            });
        });
    });
}
global.context = doric.jsObtainContext("FakeContext");
const entryHooks = [];
global.Entry = function () {
    var _a, _b, _c;
    if (!!contextId) {
        return Reflect.apply(doric.jsObtainEntry(contextId), doric, arguments);
    }
    else {
        const jsFile = (_c = (_b = (_a = new Error().stack) === null || _a === void 0 ? void 0 : _a.split("\n").map(e => e.match(/at\s__decorate.*?\s\((.*?)\)/)).find(e => !!e)) === null || _b === void 0 ? void 0 : _b[1].match(/(.*?\.js)/)) === null || _c === void 0 ? void 0 : _c[1];
        if (!jsFile) {
            throw new Error("Cannot find debugging file");
        }
        const args = arguments;
        entryHooks.push((contextId) => {
            Reflect.apply(doric.jsObtainEntry(contextId), doric, args);
        });
        if (entryHooks.length <= 1) {
            const source = path.basename(jsFile);
            console.log(`Debugging ${source}`);
            initNativeEnvironment(source).then(ret => {
                contextId = ret;
                console.log("debugging context id: " + contextId);
                const realContext = doric.jsObtainContext(contextId);
                global.context.id = contextId;
                global.context = realContext;
                entryHooks.forEach(e => e(contextId));
            });
            return arguments[0];
        }
    }
};
global.injectGlobal = (objName, obj) => {
    Reflect.set(global, objName, JSON.parse(obj));
};
global.sendToNative = () => {
};
global.receiveFromNative = () => {
};
global.nativeLog = (type, msg) => {
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
};
global.nativeRequire = () => {
    console.error("nativeRequire", new Error().stack);
    console.error("Do not call here in debugging");
    return false;
};
global.nativeBridge = () => {
    console.error("nativeBridge", new Error().stack);
    console.error("Do not call here in debugging");
    return false;
};
global.Envrionment = new Proxy({}, {
    get: (target, p, receiver) => {
        console.error("Environment Getter", new Error().stack);
        console.error("Do not call here in debugging");
        return undefined;
    },
    set: (target, p, v, receiver) => {
        console.error("Environment Setter", new Error().stack);
        console.error("Do not call here in debugging");
        return Reflect.set(target, p, v, receiver);
    }
});
global.nativeEmpty = () => {
    originSetTimeout(() => {
        for (let context of doric.allContexts()) {
            const entity = context.entity;
            if (entity instanceof Panel) {
                const panel = entity;
                if (panel.getRootView().isDirty()) {
                    const model = panel.getRootView().toModel();
                    context.callNative("shader", "render", model);
                    panel.getRootView().clean();
                }
                for (let map of panel.allHeadViews()) {
                    for (let v of map.values()) {
                        if (v.isDirty()) {
                            const model = v.toModel();
                            context.callNative("shader", "render", model);
                            v.clean();
                        }
                    }
                }
            }
        }
    }, 0);
};
export * from './index';
