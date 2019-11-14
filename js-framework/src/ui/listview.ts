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

import { View, Property, LayoutSpec, Superview, IView } from "./view";
import { Stack } from "./layout";

export function listItem(item: View) {
    return (new ListItem).also((it) => {
        it.layoutConfig = {
            widthSpec: LayoutSpec.WRAP_CONTENT,
            heightSpec: LayoutSpec.WRAP_CONTENT,
        }
        it.addChild(item)
    })
}

export class ListItem extends Stack {
    /**
     * Set to reuse native view
     */
    @Property
    identifier?: string
}

export interface IList extends IView {
    renderItem: (index: number) => ListItem
    itemCount: number
    batchCount?: number
}

export class List extends Superview implements IList {
    private cachedViews: Map<string, ListItem> = new Map

    allSubviews() {
        return this.cachedViews.values()
    }

    @Property
    itemCount = 0

    @Property
    renderItem!: (index: number) => ListItem

    @Property
    batchCount = 15

    private getItem(itemIdx: number) {
        let view = this.cachedViews.get(`${itemIdx}`)
        if (view === undefined) {
            view = this.renderItem(itemIdx)
            view.superview = this
            this.cachedViews.set(`${itemIdx}`, view)
        }
        return view
    }

    private renderBunchedItems(start: number, length: number) {
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map((_, idx) => {
            const listItem = this.getItem(start + idx)
            return listItem.toModel()
        })
    }
}