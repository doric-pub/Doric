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
import { Scroller } from "../widget/scroller"
import { List } from "../widget/list"
import { FlowLayout } from "../widget/flowlayout"
import { View } from "../ui/view"
import { Color } from "../util/color"
import { Panel } from "../ui/panel"

function viewIdChains(view: View) {
    const viewIds = []
    let thisView: View | undefined = view
    while (thisView != undefined) {
        viewIds.push(thisView.viewId)
        thisView = thisView.superview
    }
    return viewIds.reverse()
}

export function coordinator(context: BridgeContext) {
    return {
        verticalScrolling: (
            argument: {
                scrollable: Scroller | List | FlowLayout,
                scrollRange: {
                    start: number,
                    end: number,
                },
                target: View | "NavBar",
                changing: {
                    name: "backgroundColor" | "width" | "height" | "x" | "y",
                    start: number | Color
                    end: number | Color
                },
            }) => {
            if (context.entity instanceof Panel) {
                const panel = context.entity
                panel.addOnRenderFinishedCallback(() => {
                    (argument as any).scrollable = viewIdChains(argument.scrollable)
                    if (argument.target instanceof View) {
                        (argument as any).target = viewIdChains(argument.target)
                    }
                    if (argument.changing.start instanceof Color) {
                        argument.changing.start = argument.changing.start.toModel()
                    }
                    if (argument.changing.end instanceof Color) {
                        argument.changing.end = argument.changing.end.toModel()
                    }
                    context.callNative("coordinator", "verticalScrolling", argument)
                })
            }
        }
    }
}