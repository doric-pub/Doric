var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
        this.ignoreDirtyCallOnce = false;
        this.itemCount = 0;
        this.batchCount = 3;
    }
    allSubviews() {
        return this.cachedViews.values();
    }
    getItem(itemIdx) {
        let view = this.cachedViews.get(`${itemIdx}`);
        if (view === undefined) {
            view = this.renderPage(itemIdx);
            view.superview = this;
            this.cachedViews.set(`${itemIdx}`, view);
        }
        return view;
    }
    isDirty() {
        if (this.ignoreDirtyCallOnce) {
            this.ignoreDirtyCallOnce = false;
            //Ignore the dirty call once.
            return false;
        }
        return super.isDirty();
    }
    renderBunchedItems(start, length) {
        this.ignoreDirtyCallOnce = true;
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
export function slider(config) {
    const ret = new Slider;
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}
export function slideItem(item, config) {
    return (new SlideItem).also((it) => {
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
