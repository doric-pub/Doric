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
export function keyboard(context: BridgeContext) {
    return {
        subscribe: (callback: (data: { oldBottomMargin: number, oldHeight: number, bottomMargin: number, height: number }) => void) => {
            return context.callNative('keyboard', 'subscribe', context.function2Id(callback)) as Promise<string>
        },
        unsubscribe: (subscribeId: string) => {
            context.removeFuncById(subscribeId)
            return context.callNative('keyboard', 'unsubscribe', subscribeId)
        }
    }
}