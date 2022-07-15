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
import { Superview, View, Property } from "../ui/view";
import { Stack } from "./layouts";
import { layoutConfig } from "../util/layoutconfig";
import { BridgeContext } from "../runtime/global";



export class SlideItem extends Stack {
    /**
     * Set to reuse native view
     */
    @Property
    identifier?: string
}

export class Slider extends Superview {
    private cachedViews: Map<string, SlideItem> = new Map

    allSubviews() {
        return this.cachedViews.values()
    }
    @Property
    itemCount = 0

    @Property
    renderPage!: (index: number) => SlideItem

    @Property
    batchCount = 3

    @Property
    onPageSlided?: (index: number) => void

    @Property
    loop?: boolean

    @Property
    scrollable?: boolean
    /**
     * Take effect only on iOS
     */
    @Property
    bounces?: boolean

    @Property
    slideStyle?: "zoomOut"

    private getItem(itemIdx: number) {
        let view = this.renderPage(itemIdx)
        view.superview = this
        this.cachedViews.set(`${itemIdx}`, view)
        return view
    }

    private renderBunchedItems(start: number, length: number) {
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map((_, idx) => {
            const slideItem = this.getItem(start + idx)
            return slideItem.toModel()
        })
    }

    slidePage(context: BridgeContext, page: number, smooth = false) {
        return this.nativeChannel(context, "slidePage")({ page, smooth })
    }

    getSlidedPage(context: BridgeContext) {
        return this.nativeChannel(context, "getSlidedPage")() as Promise<number>
    }

}

export function slider(config: Partial<Slider>) {
    const ret = new Slider
    ret.apply(config)
    return ret
}

export function slideItem(item: View | View[], config?: Partial<SlideItem>) {
    return (new SlideItem).also((it) => {
        it.layoutConfig = layoutConfig().most()
        if (item instanceof View) {
            it.addChild(item)
        } else {
            item.forEach(e => {
                it.addChild(e)
            })
        }
        if (config) {
            for (let key in config) {
                Reflect.set(it, key, Reflect.get(config, key, config), it)
            }
        }
    })
}