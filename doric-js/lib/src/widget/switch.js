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
import { View, Property, InconsistProperty } from "../ui/view";
import { Color } from "../util/color";
import { layoutConfig } from "../util/index.util";
export class Switch extends View {
}
__decorate([
    InconsistProperty,
    __metadata("design:type", Boolean)
], Switch.prototype, "state", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], Switch.prototype, "onSwitch", void 0);
__decorate([
    Property,
    __metadata("design:type", Color)
], Switch.prototype, "offTintColor", void 0);
__decorate([
    Property,
    __metadata("design:type", Color)
], Switch.prototype, "onTintColor", void 0);
__decorate([
    Property,
    __metadata("design:type", Color)
], Switch.prototype, "thumbTintColor", void 0);
export function switchView(config) {
    const ret = new Switch;
    ret.layoutConfig = layoutConfig().just();
    ret.width = 50;
    ret.height = 30;
    ret.apply(config);
    return ret;
}
