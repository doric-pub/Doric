var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
import { Stack } from './layouts';
import { Property, Superview, View } from '../ui/view';
import { layoutConfig } from '../util/index.util';
export class FlowLayoutItem extends Stack {
}
__decorate([
    Property,
    __metadata("design:type", String)
], FlowLayoutItem.prototype, "identifier", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], FlowLayoutItem.prototype, "fullSpan", void 0);
export class FlowLayout extends Superview {
    constructor() {
        super(...arguments);
        this.cachedViews = new Map;
        this.columnCount = 2;
        this.itemCount = 0;
        this.batchCount = 15;
    }
    allSubviews() {
        const ret = [...this.cachedViews.values()];
        if (this.loadMoreView) {
            ret.push(this.loadMoreView);
        }
        return ret;
    }
    /**
     * @param context
     * @returns Returns array of visible view's index.
     */
    findVisibleItems(context) {
        return this.nativeChannel(context, 'findVisibleItems')();
    }
    /**
     * @param context
     * @returns Returns array of completely visible view's index.
     */
    findCompletelyVisibleItems(context) {
        return this.nativeChannel(context, 'findCompletelyVisibleItems')();
    }
    /**
     * Reload all list items.
     * @param context
     * @returns
     */
    reload(context) {
        return this.nativeChannel(context, 'reload')();
    }
    reset() {
        this.cachedViews.clear();
        this.itemCount = 0;
    }
    getItem(itemIdx) {
        let view = this.renderItem(itemIdx);
        view.superview = this;
        this.cachedViews.set(`${itemIdx}`, view);
        return view;
    }
    renderBunchedItems(start, length) {
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map((_, idx) => {
            const listItem = this.getItem(start + idx);
            return listItem.toModel();
        });
    }
    toModel() {
        if (this.loadMoreView) {
            this.dirtyProps['loadMoreView'] = this.loadMoreView.viewId;
        }
        return super.toModel();
    }
}
__decorate([
    Property,
    __metadata("design:type", Object)
], FlowLayout.prototype, "columnCount", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], FlowLayout.prototype, "columnSpace", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], FlowLayout.prototype, "rowSpace", void 0);
__decorate([
    Property,
    __metadata("design:type", Object)
], FlowLayout.prototype, "itemCount", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], FlowLayout.prototype, "renderItem", void 0);
__decorate([
    Property,
    __metadata("design:type", Object)
], FlowLayout.prototype, "batchCount", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], FlowLayout.prototype, "onLoadMore", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], FlowLayout.prototype, "loadMore", void 0);
__decorate([
    Property,
    __metadata("design:type", FlowLayoutItem)
], FlowLayout.prototype, "loadMoreView", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], FlowLayout.prototype, "onScroll", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], FlowLayout.prototype, "onScrollEnd", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], FlowLayout.prototype, "scrollable", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], FlowLayout.prototype, "bounces", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], FlowLayout.prototype, "canDrag", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], FlowLayout.prototype, "beforeDragging", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], FlowLayout.prototype, "onDragging", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], FlowLayout.prototype, "onDragged", void 0);
export function flowlayout(config) {
    const ret = new FlowLayout;
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}
export function flowItem(item, config) {
    return (new FlowLayoutItem).also((it) => {
        it.layoutConfig = layoutConfig().fit();
        if (item instanceof View) {
            it.addChild(item);
        }
        else {
            item.forEach(e => {
                it.addChild(e);
            });
        }
        if (config) {
            it.apply(config);
        }
    });
}
