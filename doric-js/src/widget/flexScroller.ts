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
import { View, IView, Property, Group } from '../ui/view'
import { layoutConfig } from '../util/layoutconfig'
import { BridgeContext } from '../runtime/global'

export function flexScroller(views: View[], config?: IFlexScroller) {
    const ret = new FlexScroller
    ret.layoutConfig = layoutConfig().fit()
    for (let v of views) {
        ret.addChild(v)
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret)
        }
    }
    return ret
}

export interface IFlexScroller extends IView {
    contentOffset?: { x: number, y: number }
}

export class FlexScroller extends Group implements IFlexScroller {

    @Property
    contentOffset?: { x: number, y: number }

    @Property
    onScroll?: (offset: { x: number, y: number }) => void

    @Property
    onScrollEnd?: (offset: { x: number, y: number }) => void

    scrollTo(context: BridgeContext, offset: { x: number, y: number }, animated?: boolean) {
        return this.nativeChannel(context, "scrollTo")({ offset, animated })
    }

    scrollBy(context: BridgeContext, offset: { x: number, y: number }, animated?: boolean) {
        return this.nativeChannel(context, "scrollBy")({ offset, animated })
    }
}