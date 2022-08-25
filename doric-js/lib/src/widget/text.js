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
import { View, Property } from "../ui/view";
import { Gravity } from "../util/gravity";
import { layoutConfig } from "../util/layoutconfig";
export var TruncateAt;
(function (TruncateAt) {
    TruncateAt[TruncateAt["End"] = 0] = "End";
    TruncateAt[TruncateAt["Middle"] = 1] = "Middle";
    TruncateAt[TruncateAt["Start"] = 2] = "Start";
    TruncateAt[TruncateAt["Clip"] = 3] = "Clip";
})(TruncateAt || (TruncateAt = {}));
export class Text extends View {
    set innerElement(e) {
        this.text = e;
    }
}
__decorate([
    Property,
    __metadata("design:type", String)
], Text.prototype, "text", void 0);
__decorate([
    Property,
    __metadata("design:type", Object)
], Text.prototype, "textColor", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], Text.prototype, "textSize", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], Text.prototype, "maxLines", void 0);
__decorate([
    Property,
    __metadata("design:type", Gravity)
], Text.prototype, "textAlignment", void 0);
__decorate([
    Property,
    __metadata("design:type", String)
], Text.prototype, "fontStyle", void 0);
__decorate([
    Property,
    __metadata("design:type", Object)
], Text.prototype, "font", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], Text.prototype, "maxWidth", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], Text.prototype, "maxHeight", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], Text.prototype, "lineSpacing", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], Text.prototype, "strikethrough", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], Text.prototype, "underline", void 0);
__decorate([
    Property,
    __metadata("design:type", String)
], Text.prototype, "htmlText", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], Text.prototype, "truncateAt", void 0);
__decorate([
    Property,
    __metadata("design:type", Object)
], Text.prototype, "padding", void 0);
export function text(config) {
    const ret = new Text;
    ret.layoutConfig = layoutConfig().fit();
    ret.apply(config);
    return ret;
}
