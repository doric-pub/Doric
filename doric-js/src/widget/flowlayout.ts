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
import { Stack } from './layouts'
import { Property, Superview, View, NativeViewModel } from '../ui/view'
import { layoutConfig } from '../util/index.util'

export class FlowLayoutItem extends Stack {
    /**
    * Set to reuse native view
    */
    @Property
    identifier?: string
}

export class FlowLayout extends Superview {
    private cachedViews: Map<string, FlowLayoutItem> = new Map

    allSubviews() {
        if (this.loadMoreView) {
            return [...this.cachedViews.values(), this.loadMoreView]
        } else {
            return this.cachedViews.values()
        }
    }

    @Property
    columnCount = 2

    @Property
    columnSpace?: number

    @Property
    rowSpace?: number

    @Property
    itemCount = 0

    @Property
    renderItem!: (index: number) => FlowLayoutItem

    @Property
    batchCount = 15

    @Property
    onLoadMore?: () => void

    @Property
    loadMore?: boolean

    @Property
    loadMoreView?: FlowLayoutItem

    @Property
    onScroll?: (offset: { x: number, y: number }) => void

    @Property
    onScrollEnd?: (offset: { x: number, y: number }) => void

    @Property
    scrollable?: boolean

    reset() {
        this.cachedViews.clear()
        this.itemCount = 0
    }
    private getItem(itemIdx: number) {
        let view = this.renderItem(itemIdx)
        view.superview = this
        this.cachedViews.set(`${itemIdx}`, view)
        return view
    }
    private renderBunchedItems(start: number, length: number) {
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map((_, idx) => {
            const listItem = this.getItem(start + idx)
            return listItem.toModel()
        })
    }

    toModel(): NativeViewModel {
        if (this.loadMoreView) {
            this.dirtyProps['loadMoreView'] = this.loadMoreView.viewId
        }
        return super.toModel()
    }
}

export function flowlayout(config: Partial<FlowLayout>) {
    const ret = new FlowLayout
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}

export function flowItem(item: View | View[], config?: Partial<FlowLayoutItem>) {
    return (new FlowLayoutItem).also((it) => {
        it.layoutConfig = layoutConfig().fit()
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
