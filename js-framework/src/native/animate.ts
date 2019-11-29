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
/**
 * Only supports x,y,width,height,corner(just for four corners),rotation,bgColor,
 * @param panel @see Panel
 */
export function animate(panel: Panel) {
    return (args: {
        animations: () => void,
        duration: number,
    }) => {
        return takeLet(panel.context.animate)(it => {
            return it.submit().then(() => {
                args.animations()
                return takeLet(panel.getRootView())(root => {
                    if (root.isDirty()) {
                        const model = root.toModel();
                        (model as any).duration = args.duration
                        const ret = it.animateRender(model)
                        root.clean()
                        return ret
                    }
                    for (let v of panel.allHeadViews()) {
                        if (v.isDirty()) {
                            const model = v.toModel()
                            const ret = it.animateRender(model)
                            it.clean()
                            return ret
                        }
                    }
                    throw new Error('Cannot find any animated elements')
                })
            })
        }) as Promise<any>
    }
}