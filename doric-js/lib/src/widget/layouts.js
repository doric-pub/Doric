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
import { Group, Property } from "../ui/view";
import { Gravity } from "../util/gravity";
import { layoutConfig } from "../util/layoutconfig";
export class Stack extends Group {
}
export class Root extends Stack {
}
class LinearLayout extends Group {
}
__decorate([
    Property,
    __metadata("design:type", Number)
], LinearLayout.prototype, "space", void 0);
__decorate([
    Property,
    __metadata("design:type", Gravity)
], LinearLayout.prototype, "gravity", void 0);
export class VLayout extends LinearLayout {
}
export class HLayout extends LinearLayout {
}
export function stack(views, config) {
    const ret = new Stack;
    ret.layoutConfig = layoutConfig().fit();
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret);
        }
    }
    return ret;
}
export function hlayout(views, config) {
    const ret = new HLayout;
    ret.layoutConfig = layoutConfig().fit();
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret);
        }
    }
    return ret;
}
export function vlayout(views, config) {
    const ret = new VLayout;
    ret.layoutConfig = layoutConfig().fit();
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret);
        }
    }
    return ret;
}
export class FlexLayout extends Group {
}
export function flexlayout(views, config) {
    const ret = new FlexLayout;
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret);
        }
    }
    return ret;
}
