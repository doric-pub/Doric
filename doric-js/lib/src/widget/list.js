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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { View, Property, Superview } from "../ui/view";
import { Stack } from "./layouts";
import { layoutConfig } from "../util/layoutconfig";
export class ListItem extends Stack {
}
__decorate([
    Property,
    __metadata("design:type", String)
], ListItem.prototype, "identifier", void 0);
export class List extends Superview {
    constructor() {
        super(...arguments);
        this.cachedViews = new Map;
        this.itemCount = 0;
        this.batchCount = 15;
    }
    allSubviews() {
        if (this.loadMoreView) {
            return [...this.cachedViews.values(), this.loadMoreView];
        }
        else {
            return this.cachedViews.values();
        }
    }
    scrollToItem(context, index, config) {
        const animated = config === null || config === void 0 ? void 0 : config.animated;
        return this.nativeChannel(context, 'scrollToItem')({ index, animated, });
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
        return new Array(Math.max(0, Math.min(length, this.itemCount - start))).fill(0).map((_, idx) => {
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
], List.prototype, "itemCount", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], List.prototype, "renderItem", void 0);
__decorate([
    Property,
    __metadata("design:type", Object)
], List.prototype, "batchCount", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], List.prototype, "onLoadMore", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], List.prototype, "loadMore", void 0);
__decorate([
    Property,
    __metadata("design:type", ListItem)
], List.prototype, "loadMoreView", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], List.prototype, "onScroll", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], List.prototype, "onScrollEnd", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], List.prototype, "scrolledPosition", void 0);
export function list(config) {
    const ret = new List;
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}
export function listItem(item, config) {
    return (new ListItem).also((it) => {
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
            for (let key in config) {
                Reflect.set(it, key, Reflect.get(config, key, config), it);
            }
        }
    });
}
