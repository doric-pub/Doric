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
import fs from "fs";
import path from 'path';
const contextFile = path.resolve(process.cwd(), 'build', 'context');
const contextId = fs.readFileSync(contextFile, { encoding: 'utf8' });
console.log("debugging context id: " + contextId);
let global = new Function('return this')();
global.setTimeout = global.doricSetTimeout;
global.setInterval = global.doricSetInterval;
global.clearTimeout = global.doricClearTimeout;
global.clearInterval = global.doricClearInterval;
global.doric = doric;
global.context = doric.jsObtainContext(contextId);
global.Entry = doric.jsObtainEntry(contextId);
// debug server
const debugServer = new WebSocket.Server({ port: 2080 });
debugServer.on('connection', function connection(ws) {
    console.log('connected');
    ws.on('message', function incoming(message) {
        let messageObject = JSON.parse(message);
        switch (messageObject.cmd) {
            case "injectGlobalJSObject":
                console.log(messageObject.name);
                let type = messageObject.type;
                let value = messageObject.value;
                let arg;
                if (type.type === 0) {
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
                Reflect.set(global, messageObject.name, arg);
                break;
            case "injectGlobalJSFunction":
                console.log(messageObject.name);
                Reflect.set(global, messageObject.name, function () {
                    let args = [].slice.call(arguments);
                    console.log("===============================");
                    console.log(args);
                    console.log("===============================");
                    ws.send(JSON.stringify({
                        cmd: 'injectGlobalJSFunction',
                        name: messageObject.name,
                        arguments: args
                    }));
                });
                break;
            case "invokeMethod":
                console.log(messageObject.objectName);
                console.log(messageObject.functionName);
                let args = [];
                for (let i = 0; i < messageObject.values.length; i++) {
                    let value = messageObject.values[i];
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
                console.log(args);
                console.log(messageObject.hashKey);
                let object = Reflect.get(global, messageObject.objectName);
                let method = Reflect.get(object, messageObject.functionName);
                let result = Reflect.apply(method, undefined, args);
                console.log(result);
                ws.send(JSON.stringify({
                    cmd: 'invokeMethod',
                    result: result
                }));
                break;
        }
    });
});
debugServer.on('listening', function connection(ws) {
    console.log('debugger server started on 2080');
});
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
export * from './index';
