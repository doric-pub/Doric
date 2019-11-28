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
import { Property, IView, Superview, View } from '../ui/view'
import { layoutConfig } from '../util/index.util'

export class FlowLayoutItem extends Stack {
    /**
    * Set to reuse native view
    */
    @Property
    identifier?: string
}
export interface IFlowLayout extends IView {
    renderItem: (index: number) => FlowLayoutItem

    itemCount: number

    batchCount?: number

    columnCount?: number

    columnSpace?: number

    rowSpace?: number
}

export class FlowLayout extends Superview implements IFlowLayout {
    private cachedViews: Map<string, FlowLayoutItem> = new Map
    private ignoreDirtyCallOnce = false

    allSubviews() {
        return this.cachedViews.values()
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

    reset() {
        this.cachedViews.clear()
        this.itemCount = 0
    }
    private getItem(itemIdx: number) {
        let view = this.cachedViews.get(`${itemIdx}`)
        if (view === undefined) {
            view = this.renderItem(itemIdx)
            view.superview = this
            this.cachedViews.set(`${itemIdx}`, view)
        }
        return view
    }

    isDirty() {
        if (this.ignoreDirtyCallOnce) {
            this.ignoreDirtyCallOnce = false
            //Ignore the dirty call once.
            return false
        }
        return super.isDirty()
    }

    private renderBunchedItems(start: number, length: number) {
        this.ignoreDirtyCallOnce = true;
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map((_, idx) => {
            const listItem = this.getItem(start + idx)
            return listItem.toModel()
        })
    }
}

export function flowlayout(config: IFlowLayout) {
    const ret = new FlowLayout
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}

export function flowItem(item: View) {
    return (new FlowLayoutItem).also((it) => {
        it.layoutConfig = layoutConfig().wrap()
        it.addChild(item)
    })
}
