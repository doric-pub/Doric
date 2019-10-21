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
declare function nativeLog(type: 'd' | 'w' | 'e', message: string): void

function toString(message: any) {
    if (message instanceof Function) {
        return message.toString()
    } else if (message instanceof Object) {
        try {
            return JSON.stringify(message)
        } catch (e) {
            return message.toString()
        }
    } else if (message === undefined) {
        return "undefined"
    } else {
        return message.toString()
    }
}

export function log(...args: any) {
    let out = ""
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ','
        }
        out += toString(arguments[i])
    }
    nativeLog('d', out)
}

export function loge(...message: any) {
    let out = ""
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ','
        }
        out += toString(arguments[i])
    }
    nativeLog('e', out)
}

export function logw(...message: any) {
    let out = ""
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ','
        }
        out += toString(arguments[i])
    }
    nativeLog('w', out)
}
