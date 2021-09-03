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
import { Superview, Property } from '../ui/view';
import { layoutConfig } from '../util/layoutconfig';
export function scroller(content, config) {
    return (new Scroller).also(v => {
        v.layoutConfig = layoutConfig().fit();
        if (config) {
            v.apply(config);
        }
        v.content = content;
    });
}
export class Scroller extends Superview {
    allSubviews() {
        return [this.content];
    }
    toModel() {
        this.dirtyProps.content = this.content.viewId;
        return super.toModel();
    }
    scrollTo(context, offset, animated) {
        return this.nativeChannel(context, "scrollTo")({ offset, animated });
    }
    scrollBy(context, offset, animated) {
        return this.nativeChannel(context, "scrollBy")({ offset, animated });
    }
    set innerElement(e) {
        this.content = e;
    }
}
__decorate([
    Property,
    __metadata("design:type", Object)
], Scroller.prototype, "contentOffset", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], Scroller.prototype, "onScroll", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], Scroller.prototype, "onScrollEnd", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], Scroller.prototype, "scrollable", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], Scroller.prototype, "bounces", void 0);
