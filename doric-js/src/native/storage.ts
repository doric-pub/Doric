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
import { BridgeContext } from "../runtime/global"

export function storage(context: BridgeContext) {
    return {
        setItem: (key: string, value: string, zone?: string) => {
            return context.callNative('storage', 'setItem', { key, value, zone })
        },
        getItem: (key: string, zone?: string) => {
            return context.callNative('storage', 'getItem', { key, zone }) as Promise<string>
        },
        remove: (key: string, zone?: string) => {
            return context.callNative('storage', 'remove', { key, zone })
        },
        clear: (zone: string) => {
            return context.callNative('storage', 'clear', { zone })
        },
    }
}