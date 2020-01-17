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
import { Panel } from "../ui/panel"
import { takeLet } from "../pattern/candies"
import { BridgeContext } from "../runtime/global"
/**
 * Only supports x,y,width,height,corner(just for four corners),rotation,bgColor,
 * @param panel @see Panel
 */
export function animate(context: BridgeContext) {
    const entity = context.entity
    if (entity instanceof Panel) {
        let panel = entity
        return async (args: {
            animations: () => void,
            duration: number,
        }) => {
            await context.callNative('animate', 'submit')
            args.animations()
            return takeLet(panel.getRootView())(root => {
                if (root.isDirty()) {
                    const model = root.toModel();
                    (model as any).duration = args.duration
                    const ret = context.callNative('animate', 'animateRender', model)
                    root.clean()
                    return ret
                }
                for (let map of panel.allHeadViews()) {
                    for (let v of map.values()) {
                        if (v.isDirty()) {
                            const model_1 = v.toModel()
                            const ret_1 = context.callNative('animate', 'animateRender', model_1)
                            v.clean()
                            return ret_1
                        }
                    }
                }
                throw new Error('Cannot find any animated elements')
            })
        }
    } else {
        return (args: {
            animations: () => void,
            duration: number,
        }) => {
            return Promise.reject(`Cannot find panel in Context:${context.id}`)
        }
    }

}