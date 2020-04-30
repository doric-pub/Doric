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
import { View, Property } from "../ui/view";
import { Color } from "../util/color";
import { Gravity } from "../util/gravity";
import { BridgeContext } from "../runtime/global";
import { layoutConfig } from "../util/index.util";

export class Input extends View {

    @Property
    text?: string

    @Property
    textColor?: Color

    @Property
    textSize?: number

    @Property
    hintText?: string

    @Property
    hintTextColor?: Color

    @Property
    multiline?: boolean

    @Property
    textAlignment?: Gravity

    @Property
    onTextChange?: (text: string) => void

    @Property
    onFocusChange?: (focused: boolean) => void

    @Property
    maxLength?: number

    getText(context: BridgeContext) {
        return this.nativeChannel(context, 'getText')() as Promise<string>
    }

    setSelection(context: BridgeContext, start: number, end: number = start) {
        return this.nativeChannel(context, 'setSelection')({
            start,
            end,
        }) as Promise<string>
    }

    requestFocus(context: BridgeContext) {
        return this.nativeChannel(context, 'requestFocus')()
    }

    releaseFocus(context: BridgeContext) {
        return this.nativeChannel(context, 'releaseFocus')()
    }
}

export function input(config: Partial<Input>) {
    const ret = new Input
    ret.layoutConfig = layoutConfig().just()
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}
