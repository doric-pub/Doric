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
import { Property, View } from "../ui/view";
import { Stack } from "../widget/layouts";
import { layoutConfig } from "../util/layoutconfig";
export var SwipeOrientation;
(function (SwipeOrientation) {
    SwipeOrientation[SwipeOrientation["LEFT"] = 0] = "LEFT";
    SwipeOrientation[SwipeOrientation["RIGHT"] = 1] = "RIGHT";
    SwipeOrientation[SwipeOrientation["TOP"] = 2] = "TOP";
    SwipeOrientation[SwipeOrientation["BOTTOM"] = 3] = "BOTTOM";
})(SwipeOrientation || (SwipeOrientation = {}));
export class GestureContainer extends Stack {
}
__decorate([
    Property,
    __metadata("design:type", Function)
], GestureContainer.prototype, "onSingleTap", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], GestureContainer.prototype, "onDoubleTap", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], GestureContainer.prototype, "onLongPress", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], GestureContainer.prototype, "onPinch", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], GestureContainer.prototype, "onPan", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], GestureContainer.prototype, "onRotate", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], GestureContainer.prototype, "onSwipe", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], GestureContainer.prototype, "onTouchDown", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], GestureContainer.prototype, "onTouchMove", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], GestureContainer.prototype, "onTouchUp", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], GestureContainer.prototype, "onTouchCancel", void 0);
export function gestureContainer(views, config) {
    const ret = new GestureContainer;
    ret.layoutConfig = layoutConfig().fit();
    if (views instanceof View) {
        ret.addChild(views);
    }
    else {
        views.forEach(e => {
            ret.addChild(e);
        });
    }
    if (config) {
        ret.apply(config);
    }
    return ret;
}
