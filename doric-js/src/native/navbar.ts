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
import { Panel } from "../ui/panel"
import { Color } from "../util/color"
import { View } from "../ui/view"

export function navbar(context: BridgeContext) {
    const entity = context.entity
    let panel: Panel | undefined = undefined
    if (entity instanceof Panel) {
        panel = entity
    }

    return {
        isHidden: () => {
            return context.callNative('navbar', 'isHidden') as Promise<boolean>
        },
        setHidden: (hidden: boolean) => {
            return context.callNative('navbar', 'setHidden', { hidden, })
        },
        setTitle: (title: string) => {
            return context.callNative('navbar', 'setTitle', { title, })
        },
        setBgColor: (color: Color) => {
            return context.callNative('navbar', 'setBgColor', { color: color.toModel(), })
        },
        setLeft: (view: View) => {
            if (panel) {
                panel.clearHeadViews("navbar_left")
                panel.addHeadView("navbar_left", view)
            }
            return context.callNative('navbar', 'setLeft', view.toModel())
        },
        setRight: (view: View) => {
            if (panel) {
                panel.clearHeadViews("navbar_right")
                panel.addHeadView("navbar_right", view)
            }
            return context.callNative('navbar', 'setRight', view.toModel())
        },
        setCenter: (view: View) => {
            if (panel) {
                panel.clearHeadViews("navbar_center")
                panel.addHeadView("navbar_center", view)
            }
            return context.callNative('navbar', 'setCenter', view.toModel())
        },
    }
}