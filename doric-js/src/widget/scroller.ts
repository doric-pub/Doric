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
import { Superview, View, NativeViewModel, Property } from '../ui/view'
import { layoutConfig } from '../util/layoutconfig'
import { BridgeContext } from '../runtime/global'

export function scroller(content: View, config?: Partial<Scroller>) {
    return (new Scroller).also(v => {
        v.layoutConfig = layoutConfig().fit()
        if (config) {
            v.apply(config)
        }
        v.content = content
    })
}


export class Scroller extends Superview implements JSX.ElementChildrenAttribute {
    content!: View

    @Property
    contentOffset?: { x: number, y: number }

    @Property
    onScroll?: (offset: { x: number, y: number }) => void

    @Property
    onScrollEnd?: (offset: { x: number, y: number }) => void

    @Property
    scrollable?: boolean

    /**
     * Take effect only on iOS
     */
    @Property
    bounces?: boolean

    /**
     * Take effect only on iOS
     */
    @Property
    scrollsToTop?: boolean

    allSubviews() {
        return [this.content]
    }

    toModel(): NativeViewModel {
        this.dirtyProps.content = this.content.viewId
        return super.toModel()
    }

    scrollTo(context: BridgeContext, offset: { x: number, y: number }, animated?: boolean) {
        return this.nativeChannel(context, "scrollTo")({ offset, animated })
    }

    scrollBy(context: BridgeContext, offset: { x: number, y: number }, animated?: boolean) {
        return this.nativeChannel(context, "scrollBy")({ offset, animated })
    }

    set innerElement(e: View) {
        this.content = e
    }
}