
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
import { Gravity } from "../util/gravity"

export function modal(context: BridgeContext) {
    return {
        toast: (msg: string, gravity: Gravity = Gravity.Bottom) => {
            context.modal.toast({
                msg,
                gravity: gravity.toModel(),
            })
        },
        alert: (arg: string | {
            title: string,
            msg: string,
            okLabel?: string,
        }) => {
            if (typeof arg === 'string') {
                return context.modal.alert({ msg: arg })
            } else {
                return context.modal.alert(arg)
            }
        },
        confirm: (arg: string | {
            title: string,
            msg: string,
            okLabel?: string,
            cancelLabel?: string,
        }) => {
            if (typeof arg === 'string') {
                return context.modal.confirm({ msg: arg })
            } else {
                return context.modal.confirm(arg)
            }
        },
        prompt: (arg: {
            title?: string,
            msg?: string,
            okLabel?: string,
            cancelLabel?: string,
            text?: string,
            defaultText?: string,
        }) => {
            return context.modal.prompt(arg) as Promise<string>
        },
    }
}