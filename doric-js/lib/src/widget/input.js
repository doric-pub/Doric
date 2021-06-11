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
import { Gravity } from "../util/gravity";
import { layoutConfig } from "../util/index.util";
export var ReturnKeyType;
(function (ReturnKeyType) {
    ReturnKeyType[ReturnKeyType["Default"] = 0] = "Default";
    ReturnKeyType[ReturnKeyType["Done"] = 1] = "Done";
    ReturnKeyType[ReturnKeyType["Search"] = 2] = "Search";
    ReturnKeyType[ReturnKeyType["Next"] = 3] = "Next";
    ReturnKeyType[ReturnKeyType["Go"] = 4] = "Go";
    ReturnKeyType[ReturnKeyType["Send"] = 5] = "Send";
})(ReturnKeyType || (ReturnKeyType = {}));
export class Input extends View {
    getText(context) {
        return this.nativeChannel(context, 'getText')();
    }
    setSelection(context, start, end = start) {
        return this.nativeChannel(context, 'setSelection')({
            start,
            end,
        });
    }
    getSelection(context) {
        return this.nativeChannel(context, 'getSelection')();
    }
    requestFocus(context) {
        return this.nativeChannel(context, 'requestFocus')();
    }
    releaseFocus(context) {
        return this.nativeChannel(context, 'releaseFocus')();
    }
}
__decorate([
    InconsistProperty,
    __metadata("design:type", String)
], Input.prototype, "text", void 0);
__decorate([
    Property,
    __metadata("design:type", Color)
], Input.prototype, "textColor", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], Input.prototype, "textSize", void 0);
__decorate([
    Property,
    __metadata("design:type", String)
], Input.prototype, "hintText", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], Input.prototype, "inputType", void 0);
__decorate([
    Property,
    __metadata("design:type", Color)
], Input.prototype, "hintTextColor", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], Input.prototype, "multiline", void 0);
__decorate([
    Property,
    __metadata("design:type", Gravity)
], Input.prototype, "textAlignment", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], Input.prototype, "onTextChange", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], Input.prototype, "onFocusChange", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], Input.prototype, "maxLength", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], Input.prototype, "password", void 0);
__decorate([
    Property,
    __metadata("design:type", Boolean)
], Input.prototype, "editable", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], Input.prototype, "returnKeyType", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], Input.prototype, "onSubmitEditing", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], Input.prototype, "beforeTextChange", void 0);
export var InputType;
(function (InputType) {
    InputType[InputType["Default"] = 0] = "Default";
    InputType[InputType["Number"] = 1] = "Number";
    InputType[InputType["Decimal"] = 2] = "Decimal";
    InputType[InputType["Alphabet"] = 3] = "Alphabet";
    InputType[InputType["Phone"] = 4] = "Phone";
})(InputType || (InputType = {}));
export function input(config) {
    const ret = new Input;
    ret.layoutConfig = layoutConfig().just();
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}
