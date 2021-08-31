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
import { View, Property, InconsistProperty } from "../ui/view";
import { Color } from "../util/color";
import { layoutConfig } from "../util/index.util";

export class Switch extends View {
    /**
     * True is on ,false is off,defalut is off.
     */
    @InconsistProperty
    state?: boolean
    /**
     * Switch change callback
     */
    @Property
    onSwitch?: (state: boolean) => void

    @Property
    offTintColor?: Color

    @Property
    onTintColor?: Color

    @Property
    thumbTintColor?: Color
}

export function switchView(config: Partial<Switch>) {
    const ret = new Switch
    ret.layoutConfig = layoutConfig().just()
    ret.width = 50
    ret.height = 30
    ret.apply(config)
    return ret
}
