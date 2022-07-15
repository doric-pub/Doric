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
import { Superview, View, Property } from "../ui/view";
import { Stack } from "./layouts";
import { layoutConfig } from "../util/layoutconfig";
export class SlideItem extends Stack {
}
__decorate([
    Property,
    __metadata("design:type", String)
], SlideItem.prototype, "identifier", void 0);
export class Slider extends Superview {
    constructor() {
        super(...arguments);
        this.cachedViews = new Map;
        this.itemCount = 0;
        this.batchCount = 3;
    }
    allSubviews() {
        return this.cachedViews.values();
    }
    getItem(itemIdx) {
        let view = this.renderPage(itemIdx);
        view.superview = this;
        this.cachedViews.set(`${itemIdx}`, view);
        return view;
    }
    renderBunchedItems(start, length) {
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map((_, idx) => {
            const slideItem = this.getItem(start + idx);
            return slideItem.toModel();
        });
    }
    slidePage(context, page, smooth = false) {
        return this.nativeChannel(context, "slidePage")({ page, smooth });
    }
    getSlidedPage(context) {
        return this.nativeChannel(context, "getSlidedPage")();
    }
}
__decorate([
    Property,
    __metadata("design:type", Object)
], Slider.prototype, "itemCount", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], Slider.prototype, "renderPage", void 0);
__decorate([
    Property,
    __metadata("design:type", Object)
], Slider.prototype, "batchCount", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], Slider.prototype, "onPageSlided", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], Slider.prototype, "loop", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], Slider.prototype, "scrollable", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], Slider.prototype, "bounces", void 0);
__decorate([
    Property,
    __metadata("design:type", Object)
], Slider.prototype, "slideStyle", void 0);
export function slider(config) {
    const ret = new Slider;
    ret.apply(config);
    return ret;
}
export function slideItem(item, config) {
    return (new SlideItem).also((it) => {
        it.layoutConfig = layoutConfig().most();
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
