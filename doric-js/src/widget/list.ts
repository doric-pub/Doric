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

import { View, Property, Superview, NativeViewModel } from "../ui/view";
import { Stack } from "./layouts";
import { layoutConfig } from "../util/layoutconfig";
import { BridgeContext } from "../runtime/global";
import { Color } from "../util/color";

export class ListItem extends Stack {
    /**
     * Set to reuse native view
     */
    @Property
    identifier?: string

    @Property
    actions?: {
        title: string,
        backgroundColor?: Color,
        callback: () => void,
    }[]
}

export enum OtherItems {
    LoadMore = -10,
    Header = -11,
    Footer = -12,
}

export class List extends Superview {
    private cachedViews: Map<string, ListItem> = new Map

    allSubviews() {
        const ret = [...this.cachedViews.values()]
        if (this.loadMoreView) {
            ret.push(this.loadMoreView)
        }
        if (this.header) {
            ret.push(this.header)
        }
        if (this.footer) {
            ret.push(this.footer)
        }
        return ret
    }

    @Property
    itemCount = 0

    @Property
    renderItem!: (index: number) => ListItem

    @Property
    batchCount = 15

    @Property
    onLoadMore?: () => void

    @Property
    loadMore?: boolean

    @Property
    loadMoreView?: ListItem

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

    @Property
    header?: ListItem

    @Property
    footer?: ListItem

    scrollToItem(context: BridgeContext, index: number, config?: { animated?: boolean, }) {
        const animated = config?.animated
        return this.nativeChannel(context, 'scrollToItem')({ index, animated, }) as Promise<any>
    }
    /**
     * @param context 
     * @returns Returns the range of the visible views.
     */
    findVisibleItems(context: BridgeContext) {
        return this.nativeChannel(context, 'findVisibleItems')() as Promise<{ first: number, last: number }>
    }
    /**
     * @param context 
     * @returns Returns the range of the completely visible views.
     */
    findCompletelyVisibleItems(context: BridgeContext) {
        return this.nativeChannel(context, 'findCompletelyVisibleItems')() as Promise<{ first: number, last: number }>
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
        return new Array(Math.max(0, Math.min(length, this.itemCount - start))).fill(0).map((_, idx) => {
            const listItem = this.getItem(start + idx)
            return listItem.toModel()
        })
    }

    toModel(): NativeViewModel {
        if (this.loadMoreView) {
            this.dirtyProps['loadMoreView'] = this.loadMoreView.viewId
        }
        if (this.header) {
            this.dirtyProps['header'] = this.header.viewId
        }
        if (this.footer) {
            this.dirtyProps['footer'] = this.footer.viewId
        }
        return super.toModel()
    }
}

export function list(config: Partial<List>) {
    const ret = new List
    ret.apply(config)
    return ret
}

export function listItem(item: View | View[], config?: Partial<ListItem>) {
    return (new ListItem).also((it) => {
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

