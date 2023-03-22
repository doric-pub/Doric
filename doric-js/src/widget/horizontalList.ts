/*
 * Copyright [2022] [Doric.Pub]
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

import { View, Property, Superview, NativeViewModel } from "../ui/view";
import { Stack } from "./layouts";
import { layoutConfig } from "../util/layoutconfig";
import { BridgeContext } from "../runtime/global";
import { Color } from "../util/color";
import { deepClone } from "./utils";

export class HorizontalListItem extends Stack {
    /**
     * Set to reuse native view
     */
    @Property
    identifier?: string

    // @Property
    // actions?: {
    //     title: string,
    //     backgroundColor?: Color,
    //     callback: () => void,
    // }[]
}

export class HorizontalList extends Superview {
    private cachedViews: Map<string, HorizontalListItem> = new Map

    allSubviews() {
        const ret = [...this.cachedViews.values()]
        if (this.loadMoreView) {
            ret.push(this.loadMoreView)
        }
        return ret
    }

    @Property
    itemCount = 0

    @Property
    renderItem!: (index: number) => HorizontalListItem

    @Property
    batchCount = 15

    @Property
    onLoadMore?: () => void

    @Property
    loadMore?: boolean

    @Property
    loadMoreView?: HorizontalListItem

    @Property
    onScroll?: (offset: { x: number, y: number }) => void

    @Property
    onScrollEnd?: (offset: { x: number, y: number }) => void

    @Property
    scrolledPosition?: number

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

    @Property
    canDrag?: boolean

    /**
     * @param from 
     * @returns Returns the item of index which can dragged or not.
     */
    @Property
    itemCanDrag?: (from: number) => boolean

    /**
     * @param from 
     * @returns Returns an array of index which can not be swap during dragging.
     */
    @Property
    beforeDragging?: (from: number) => (Array<number> | void)

    @Property
    onDragging?: (from: number, to: number) => void

    @Property
    onDragged?: (from: number, to: number) => void

    scrollToItem(context: BridgeContext, index: number, config?: { animated?: boolean, }) {
        const animated = config?.animated
        return this.nativeChannel(context, 'scrollToItem')({ index, animated, }) as Promise<any>
    }
    /**
     * @param context 
     * @returns Returns array of visible view's index.
     */
    findVisibleItems(context: BridgeContext) {
        return this.nativeChannel(context, 'findVisibleItems')() as Promise<number[]>
    }
    /**
     * @param context 
     * @returns Returns array of completely visible view's index.
     */
    findCompletelyVisibleItems(context: BridgeContext) {
        return this.nativeChannel(context, 'findCompletelyVisibleItems')() as Promise<number[]>
    }

    /**
     * Reload all list items.
     * @param context 
     * @returns 
     */
    reload(context: BridgeContext) {
        return this.nativeChannel(context, 'reload')() as Promise<void>
    }

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
        const items = new Array(Math.max(0, Math.min(length, this.itemCount - start)))
            .fill(0).map((_, idx) => this.getItem(start + idx))
        const ret = items.map(e => deepClone(e.toModel()))
        items.forEach(e => e.clean())
        return ret
    }

    toModel(): NativeViewModel {
        if (this.loadMoreView) {
            this.dirtyProps['loadMoreView'] = this.loadMoreView.viewId
        }
        return super.toModel()
    }
}

export function horizontalList(config: Partial<HorizontalList>) {
    const ret = new HorizontalList
    ret.apply(config)
    return ret
}

export function horizontalListItem(item: View | View[], config?: Partial<HorizontalListItem>) {
    return (new HorizontalListItem).also((it) => {
        it.layoutConfig = layoutConfig().fit()
        if (item instanceof View) {
            it.addChild(item)
        } else {
            item.forEach(e => {
                it.addChild(e)
            })
        }
        if (config) {
            it.apply(config)
        }
    })
}

