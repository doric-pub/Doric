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
import { View } from "./view";
import { loge } from '../util/log';
import { Root } from '../widget/layouts';
export function NativeCall(target, propertyKey, descriptor) {
    const originVal = descriptor.value;
    descriptor.value = function () {
        const ret = Reflect.apply(originVal, this, arguments);
        return ret;
    };
    return descriptor;
}
export class Panel {
    constructor() {
        this.destroyed = false;
        this.__root__ = new Root;
        this.headviews = new Map;
        this.onRenderFinishedCallback = [];
        this.__rendering__ = false;
    }
    onCreate() { }
    onDestroy() { }
    onShow() { }
    onHidden() { }
    addHeadView(type, v) {
        let map = this.headviews.get(type);
        if (map) {
            map.set(v.viewId, v);
        }
        else {
            map = new Map;
            map.set(v.viewId, v);
            this.headviews.set(type, map);
        }
    }
    allHeadViews() {
        return this.headviews.values();
    }
    removeHeadView(type, v) {
        if (this.headviews.has(type)) {
            let map = this.headviews.get(type);
            if (map) {
                if (v instanceof View) {
                    map.delete(v.viewId);
                }
                else {
                    map.delete(v);
                }
            }
        }
    }
    clearHeadViews(type) {
        if (this.headviews.has(type)) {
            this.headviews.delete(type);
        }
    }
    getRootView() {
        return this.__root__;
    }
    getInitData() {
        return this.__data__;
    }
    __init__(data) {
        if (data) {
            this.__data__ = JSON.parse(data);
        }
    }
    __onCreate__() {
        this.onCreate();
    }
    __onDestroy__() {
        this.destroyed = true;
        this.onDestroy();
    }
    __onShow__() {
        this.onShow();
    }
    __onHidden__() {
        this.onHidden();
    }
    __build__(frame) {
        this.__root__.width = frame.width;
        this.__root__.height = frame.height;
        this.__root__.children.length = 0;
        this.build(this.__root__);
    }
    __response__(viewIds, callbackId) {
        const v = this.retrospectView(viewIds);
        if (v === undefined) {
            loge(`Cannot find view for ${viewIds}`);
        }
        else {
            const argumentsList = [callbackId];
            for (let i = 2; i < arguments.length; i++) {
                argumentsList.push(arguments[i]);
            }
            return Reflect.apply(v.responseCallback, v, argumentsList);
        }
    }
    retrospectView(ids) {
        return ids.reduce((acc, cur) => {
            if (acc === undefined) {
                if (cur === this.__root__.viewId) {
                    return this.__root__;
                }
                for (let map of this.headviews.values()) {
                    if (map.has(cur)) {
                        return map.get(cur);
                    }
                }
                return undefined;
            }
            else {
                if (Reflect.has(acc, "subviewById")) {
                    return Reflect.apply(Reflect.get(acc, "subviewById"), acc, [cur]);
                }
                return acc;
            }
        }, undefined);
    }
    nativeRender(model) {
        return this.context.callNative("shader", "render", model);
    }
    hookBeforeNativeCall() {
        if (Environment.platform !== 'web') {
            this.__root__.clean();
            for (let map of this.headviews.values()) {
                for (let v of map.values()) {
                    v.clean();
                }
            }
        }
    }
    hookAfterNativeCall() {
        if (this.destroyed) {
            return;
        }
        const promises = [];
        if (Environment.platform !== 'web') {
            //Here insert a native call to ensure the promise is resolved done.
            nativeEmpty();
            if (this.__root__.isDirty()) {
                const model = this.__root__.toModel();
                promises.push(this.nativeRender(model));
            }
            for (let map of this.headviews.values()) {
                for (let v of map.values()) {
                    if (v.isDirty()) {
                        const model = v.toModel();
                        promises.push(this.nativeRender(model));
                    }
                }
            }
        }
        else {
            Promise.resolve().then(() => {
                if (this.__root__.isDirty()) {
                    const model = this.__root__.toModel();
                    promises.push(this.nativeRender(model));
                    this.__root__.clean();
                }
                for (let map of this.headviews.values()) {
                    for (let v of map.values()) {
                        if (v.isDirty()) {
                            const model = v.toModel();
                            promises.push(this.nativeRender(model));
                            v.clean();
                        }
                    }
                }
            });
        }
        if (this.__rendering__) {
            //skip
            Promise.all(promises).then(_ => {
            });
        }
        else {
            this.__rendering__ = true;
            Promise.all(promises).then(_ => {
                this.__rendering__ = false;
                this.onRenderFinished();
            });
        }
    }
    onRenderFinished() {
        this.onRenderFinishedCallback.forEach(e => {
            e();
        });
        this.onRenderFinishedCallback.length = 0;
    }
    addOnRenderFinishedCallback(cb) {
        this.onRenderFinishedCallback.push(cb);
    }
}
__decorate([
    NativeCall,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Panel.prototype, "__init__", null);
__decorate([
    NativeCall,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Panel.prototype, "__onCreate__", null);
__decorate([
    NativeCall,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Panel.prototype, "__onDestroy__", null);
__decorate([
    NativeCall,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Panel.prototype, "__onShow__", null);
__decorate([
    NativeCall,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Panel.prototype, "__onHidden__", null);
__decorate([
    NativeCall,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Panel.prototype, "__build__", null);
__decorate([
    NativeCall,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", void 0)
], Panel.prototype, "__response__", null);
