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
import { View } from "../ui/view"
import { Panel } from "../ui/panel"

export function popover(context: BridgeContext) {
    const entity = context.entity
    let panel: Panel | undefined = undefined
    if (entity instanceof Panel) {
        panel = entity
    }
    return {
        show: (view: View) => {
            if (panel) {
                panel.addHeadView(view)
            }
            return context.popover.show(view.toModel())
        },
        dismiss: (view: View | undefined = undefined) => {
            if (panel && view) {
                panel.removeHeadView(view)
            }
            return context.popover.dismiss()
        },
    }
}