'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var reflectMetadata = require('reflect-metadata');

function obj2Model(obj) {
    if (obj instanceof Array) {
        return obj.map(e => obj2Model(e));
    }
    else if (obj instanceof Object) {
        if (Reflect.has(obj, 'toModel') && Reflect.get(obj, 'toModel') instanceof Function) {
            obj = Reflect.apply(Reflect.get(obj, 'toModel'), obj, []);
            return obj;
        }
        else {
            for (let key in obj) {
                const val = Reflect.get(obj, key);
                Reflect.set(obj, key, obj2Model(val));
            }
            return obj;
        }
    }
    else {
        return obj;
    }
}

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
let __uniqueId__ = 0;
function uniqueId(prefix) {
    return `__${prefix}_${__uniqueId__++}__`;
}

function toString(message) {
    if (message instanceof Function) {
        return message.toString();
    }
    else if (message instanceof Object) {
        try {
            return JSON.stringify(message);
        }
        catch (e) {
            return message.toString();
        }
    }
    else if (message === undefined) {
        return "undefined";
    }
    else {
        return message.toString();
    }
}
function loge(...message) {
    let out = "";
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ',';
        }
        out += toString(arguments[i]);
    }
    nativeLog('e', out);
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function Property(target, propKey) {
    Reflect.defineMetadata(propKey, true, target);
}
let View = /** @class */ (() => {
    class View {
        constructor() {
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
            this.viewId = uniqueId('ViewId');
            this.callbacks = new Map;
            /** Anchor end*/
            this.__dirty_props__ = {};
            this.nativeViewModel = {
                id: this.viewId,
                type: this.constructor.name,
                props: this.__dirty_props__,
            };
            return new Proxy(this, {
                get: (target, p, receiver) => {
                    return Reflect.get(target, p, receiver);
                },
                set: (target, p, v, receiver) => {
                    const oldV = Reflect.get(target, p, receiver);
                    const ret = Reflect.set(target, p, v, receiver);
                    if (Reflect.getMetadata(p, target) && oldV !== v) {
                        receiver.onPropertyChanged(p.toString(), oldV, v);
                    }
                    return ret;
                }
            });
        }
        callback2Id(f) {
            const id = uniqueId('Function');
            this.callbacks.set(id, f);
            return id;
        }
        id2Callback(id) {
            let f = this.callbacks.get(id);
            if (f === undefined) {
                f = Reflect.get(this, id);
            }
            return f;
        }
        /** Anchor start*/
        get left() {
            return this.x;
        }
        set left(v) {
            this.x = v;
        }
        get right() {
            return this.x + this.width;
        }
        set right(v) {
            this.x = v - this.width;
        }
        get top() {
            return this.y;
        }
        set top(v) {
            this.y = v;
        }
        get bottom() {
            return this.y + this.height;
        }
        set bottom(v) {
            this.y = v - this.height;
        }
        get centerX() {
            return this.x + this.width / 2;
        }
        get centerY() {
            return this.y + this.height / 2;
        }
        set centerX(v) {
            this.x = v - this.width / 2;
        }
        set centerY(v) {
            this.y = v - this.height / 2;
        }
        get dirtyProps() {
            return this.__dirty_props__;
        }
        onPropertyChanged(propKey, oldV, newV) {
            if (newV instanceof Function) {
                newV = this.callback2Id(newV);
            }
            else {
                newV = obj2Model(newV);
            }
            this.__dirty_props__[propKey] = newV;
        }
        clean() {
            for (const key in this.__dirty_props__) {
                if (Reflect.has(this.__dirty_props__, key)) {
                    Reflect.deleteProperty(this.__dirty_props__, key);
                }
            }
        }
        isDirty() {
            return Reflect.ownKeys(this.__dirty_props__).length !== 0;
        }
        responseCallback(id, ...args) {
            const f = this.id2Callback(id);
            if (f instanceof Function) {
                const argumentsList = [];
                for (let i = 1; i < arguments.length; i++) {
                    argumentsList.push(arguments[i]);
                }
                return Reflect.apply(f, this, argumentsList);
            }
            else {
                loge(`Cannot find callback:${id} for ${JSON.stringify(this.toModel())}`);
            }
        }
        toModel() {
            return this.nativeViewModel;
        }
        let(block) {
            block(this);
        }
        also(block) {
            block(this);
            return this;
        }
        apply(config) {
            for (let key in config) {
                Reflect.set(this, key, Reflect.get(config, key, config), this);
            }
            return this;
        }
        in(group) {
            group.addChild(this);
            return this;
        }
        nativeChannel(context, name) {
            let thisView = this;
            return function (args = undefined) {
                const viewIds = [];
                while (thisView != undefined) {
                    viewIds.push(thisView.viewId);
                    thisView = thisView.superview;
                }
                const params = {
                    viewIds: viewIds.reverse(),
                    name,
                    args,
                };
                return context.callNative('shader', 'command', params);
            };
        }
        getWidth(context) {
            return this.nativeChannel(context, 'getWidth')();
        }
        getHeight(context) {
            return this.nativeChannel(context, 'getHeight')();
        }
        getX(context) {
            return this.nativeChannel(context, 'getX')();
        }
        getY(context) {
            return this.nativeChannel(context, 'getY')();
        }
        getLocationOnScreen(context) {
            return this.nativeChannel(context, "getLocationOnScreen")();
        }
        doAnimation(context, animation) {
            return this.nativeChannel(context, "doAnimation")(animation.toModel()).then((args) => {
                for (let key in args) {
                    Reflect.set(this, key, Reflect.get(args, key, args), this);
                    Reflect.deleteProperty(this.__dirty_props__, key);
                }
            });
        }
    }
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "width", void 0);
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "height", void 0);
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "x", void 0);
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "y", void 0);
    __decorate([
        Property,
        __metadata("design:type", Object)
    ], View.prototype, "backgroundColor", void 0);
    __decorate([
        Property,
        __metadata("design:type", Object)
    ], View.prototype, "corners", void 0);
    __decorate([
        Property,
        __metadata("design:type", Object)
    ], View.prototype, "border", void 0);
    __decorate([
        Property,
        __metadata("design:type", Object)
    ], View.prototype, "shadow", void 0);
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "alpha", void 0);
    __decorate([
        Property,
        __metadata("design:type", Boolean)
    ], View.prototype, "hidden", void 0);
    __decorate([
        Property,
        __metadata("design:type", Object)
    ], View.prototype, "padding", void 0);
    __decorate([
        Property,
        __metadata("design:type", Object)
    ], View.prototype, "layoutConfig", void 0);
    __decorate([
        Property,
        __metadata("design:type", Function)
    ], View.prototype, "onClick", void 0);
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "translationX", void 0);
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "translationY", void 0);
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "scaleX", void 0);
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "scaleY", void 0);
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "pivotX", void 0);
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "pivotY", void 0);
    __decorate([
        Property,
        __metadata("design:type", Number)
    ], View.prototype, "rotation", void 0);
    __decorate([
        Property,
        __metadata("design:type", Object)
    ], View.prototype, "flexConfig", void 0);
    return View;
})();
class Superview extends View {
    subviewById(id) {
        for (let v of this.allSubviews()) {
            if (v.viewId === id) {
                return v;
            }
        }
    }
    isDirty() {
        if (super.isDirty()) {
            return true;
        }
        else {
            for (const v of this.allSubviews()) {
                if (v.isDirty()) {
                    return true;
                }
            }
        }
        return false;
    }
    clean() {
        for (let v of this.allSubviews()) {
            v.clean();
        }
        super.clean();
    }
    toModel() {
        const subviews = [];
        for (let v of this.allSubviews()) {
            if (v != undefined) {
                v.superview = this;
                if (v.isDirty()) {
                    subviews.push(v.toModel());
                }
            }
        }
        this.dirtyProps.subviews = subviews;
        return super.toModel();
    }
}
class Group extends Superview {
    constructor() {
        super(...arguments);
        this.children = new Proxy([], {
            set: (target, index, value) => {
                const ret = Reflect.set(target, index, value);
                // Let getDirty return true
                this.dirtyProps.children = this.children.map(e => e.viewId);
                return ret;
            }
        });
    }
    allSubviews() {
        return this.children;
    }
    addChild(view) {
        this.children.push(view);
    }
}

const SPECIFIED = 1;
const START = 1 << 1;
const END = 1 << 2;
const SHIFT_X = 0;
const SHIFT_Y = 4;
const LEFT = (START | SPECIFIED) << SHIFT_X;
const RIGHT = (END | SPECIFIED) << SHIFT_X;
const TOP = (START | SPECIFIED) << SHIFT_Y;
const BOTTOM = (END | SPECIFIED) << SHIFT_Y;
const CENTER_X = SPECIFIED << SHIFT_X;
const CENTER_Y = SPECIFIED << SHIFT_Y;
const CENTER = CENTER_X | CENTER_Y;
let Gravity = /** @class */ (() => {
    class Gravity {
        constructor() {
            this.val = 0;
        }
        left() {
            const val = this.val | LEFT;
            const ret = new Gravity;
            ret.val = val;
            return ret;
        }
        right() {
            const val = this.val | RIGHT;
            const ret = new Gravity;
            ret.val = val;
            return ret;
        }
        top() {
            const val = this.val | TOP;
            const ret = new Gravity;
            ret.val = val;
            return ret;
        }
        bottom() {
            const val = this.val | BOTTOM;
            const ret = new Gravity;
            ret.val = val;
            return ret;
        }
        center() {
            const val = this.val | CENTER;
            const ret = new Gravity;
            ret.val = val;
            return ret;
        }
        centerX() {
            const val = this.val | CENTER_X;
            const ret = new Gravity;
            ret.val = val;
            return ret;
        }
        centerY() {
            const val = this.val | CENTER_Y;
            const ret = new Gravity;
            ret.val = val;
            return ret;
        }
        toModel() {
            return this.val;
        }
    }
    Gravity.origin = new Gravity;
    Gravity.Center = Gravity.origin.center();
    Gravity.CenterX = Gravity.origin.centerX();
    Gravity.CenterY = Gravity.origin.centerY();
    Gravity.Left = Gravity.origin.left();
    Gravity.Right = Gravity.origin.right();
    Gravity.Top = Gravity.origin.top();
    Gravity.Bottom = Gravity.origin.bottom();
    return Gravity;
})();

var LayoutSpec;
(function (LayoutSpec) {
    /**
     * Depends on what's been set on width or height.
    */
    LayoutSpec[LayoutSpec["JUST"] = 0] = "JUST";
    /**
     * Depends on it's content.
     */
    LayoutSpec[LayoutSpec["FIT"] = 1] = "FIT";
    /**
     * Extend as much as parent let it take.
     */
    LayoutSpec[LayoutSpec["MOST"] = 2] = "MOST";
})(LayoutSpec || (LayoutSpec = {}));

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$1 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class Stack extends Group {
}
class Root extends Stack {
}
let LinearLayout = /** @class */ (() => {
    class LinearLayout extends Group {
    }
    __decorate$1([
        Property,
        __metadata$1("design:type", Number)
    ], LinearLayout.prototype, "space", void 0);
    __decorate$1([
        Property,
        __metadata$1("design:type", Gravity)
    ], LinearLayout.prototype, "gravity", void 0);
    return LinearLayout;
})();

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$2 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function NativeCall(target, propertyKey, descriptor) {
    const originVal = descriptor.value;
    descriptor.value = function () {
        const ret = Reflect.apply(originVal, this, arguments);
        return ret;
    };
    return descriptor;
}
let Panel = /** @class */ (() => {
    class Panel {
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
    __decorate$2([
        NativeCall,
        __metadata$2("design:type", Function),
        __metadata$2("design:paramtypes", [String]),
        __metadata$2("design:returntype", void 0)
    ], Panel.prototype, "__init__", null);
    __decorate$2([
        NativeCall,
        __metadata$2("design:type", Function),
        __metadata$2("design:paramtypes", []),
        __metadata$2("design:returntype", void 0)
    ], Panel.prototype, "__onCreate__", null);
    __decorate$2([
        NativeCall,
        __metadata$2("design:type", Function),
        __metadata$2("design:paramtypes", []),
        __metadata$2("design:returntype", void 0)
    ], Panel.prototype, "__onDestroy__", null);
    __decorate$2([
        NativeCall,
        __metadata$2("design:type", Function),
        __metadata$2("design:paramtypes", []),
        __metadata$2("design:returntype", void 0)
    ], Panel.prototype, "__onShow__", null);
    __decorate$2([
        NativeCall,
        __metadata$2("design:type", Function),
        __metadata$2("design:paramtypes", []),
        __metadata$2("design:returntype", void 0)
    ], Panel.prototype, "__onHidden__", null);
    __decorate$2([
        NativeCall,
        __metadata$2("design:type", Function),
        __metadata$2("design:paramtypes", [Object]),
        __metadata$2("design:returntype", void 0)
    ], Panel.prototype, "__build__", null);
    __decorate$2([
        NativeCall,
        __metadata$2("design:type", Function),
        __metadata$2("design:paramtypes", [Array, String]),
        __metadata$2("design:returntype", void 0)
    ], Panel.prototype, "__response__", null);
    return Panel;
})();

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
var RepeatMode;
(function (RepeatMode) {
    RepeatMode[RepeatMode["RESTART"] = 1] = "RESTART";
    RepeatMode[RepeatMode["REVERSE"] = 2] = "REVERSE";
})(RepeatMode || (RepeatMode = {}));
var FillMode;
(function (FillMode) {
    /**
     * The receiver is removed from the presentation when the animation is completed.
     */
    FillMode[FillMode["Removed"] = 0] = "Removed";
    /**
     * The receiver remains visible in its final state when the animation is completed.
     */
    FillMode[FillMode["Forward"] = 1] = "Forward";
    /**
     * The receiver clamps values before zero to zero when the animation is completed.
     */
    FillMode[FillMode["Backward"] = 2] = "Backward";
    /**
     * The receiver clamps values at both ends of the object’s time space
     */
    FillMode[FillMode["Both"] = 3] = "Both";
})(FillMode || (FillMode = {}));
var TimingFunction;
(function (TimingFunction) {
    /**
     * The system default timing function. Use this function to ensure that the timing of your animations matches that of most system animations.
     */
    TimingFunction[TimingFunction["Default"] = 0] = "Default";
    /**
     * Linear pacing, which causes an animation to occur evenly over its duration.
     */
    TimingFunction[TimingFunction["Linear"] = 1] = "Linear";
    /**
     * Ease-in pacing, which causes an animation to begin slowly and then speed up as it progresses.
     */
    TimingFunction[TimingFunction["EaseIn"] = 2] = "EaseIn";
    /**
     * Ease-out pacing, which causes an animation to begin quickly and then slow as it progresses.
     */
    TimingFunction[TimingFunction["EaseOut"] = 3] = "EaseOut";
    /**
     * Ease-in-ease-out pacing, which causes an animation to begin slowly, accelerate through the middle of its duration, and then slow again before completing.
     */
    TimingFunction[TimingFunction["EaseInEaseOut"] = 4] = "EaseInEaseOut";
})(TimingFunction || (TimingFunction = {}));

/**
 *  Store color as format AARRGGBB or RRGGBB
 */
let Color = /** @class */ (() => {
    class Color {
        constructor(v) {
            this._value = 0;
            this._value = v | 0x0;
        }
        static parse(str) {
            if (!str.startsWith("#")) {
                throw new Error(`Parse color error with ${str}`);
            }
            const val = parseInt(str.substr(1), 16);
            if (str.length === 7) {
                return new Color(val | 0xff000000);
            }
            else if (str.length === 9) {
                return new Color(val);
            }
            else {
                throw new Error(`Parse color error with ${str}`);
            }
        }
        static safeParse(str, defVal = Color.TRANSPARENT) {
            let color = defVal;
            try {
                color = Color.parse(str);
            }
            catch (e) {
            }
            finally {
                return color;
            }
        }
        alpha(v) {
            v = v * 255;
            return new Color((this._value & 0xffffff) | ((v & 0xff) << 24));
        }
        toModel() {
            return this._value;
        }
    }
    Color.BLACK = new Color(0xFF000000);
    Color.DKGRAY = new Color(0xFF444444);
    Color.GRAY = new Color(0xFF888888);
    Color.LTGRAY = new Color(0xFFCCCCCC);
    Color.WHITE = new Color(0xFFFFFFFF);
    Color.RED = new Color(0xFFFF0000);
    Color.GREEN = new Color(0xFF00FF00);
    Color.BLUE = new Color(0xFF0000FF);
    Color.YELLOW = new Color(0xFFFFFF00);
    Color.CYAN = new Color(0xFF00FFFF);
    Color.MAGENTA = new Color(0xFFFF00FF);
    Color.TRANSPARENT = new Color(0);
    return Color;
})();
var GradientOrientation;
(function (GradientOrientation) {
    /** draw the gradient from the top to the bottom */
    GradientOrientation[GradientOrientation["TOP_BOTTOM"] = 0] = "TOP_BOTTOM";
    /** draw the gradient from the top-right to the bottom-left */
    GradientOrientation[GradientOrientation["TR_BL"] = 1] = "TR_BL";
    /** draw the gradient from the right to the left */
    GradientOrientation[GradientOrientation["RIGHT_LEFT"] = 2] = "RIGHT_LEFT";
    /** draw the gradient from the bottom-right to the top-left */
    GradientOrientation[GradientOrientation["BR_TL"] = 3] = "BR_TL";
    /** draw the gradient from the bottom to the top */
    GradientOrientation[GradientOrientation["BOTTOM_TOP"] = 4] = "BOTTOM_TOP";
    /** draw the gradient from the bottom-left to the top-right */
    GradientOrientation[GradientOrientation["BL_TR"] = 5] = "BL_TR";
    /** draw the gradient from the left to the right */
    GradientOrientation[GradientOrientation["LEFT_RIGHT"] = 6] = "LEFT_RIGHT";
    /** draw the gradient from the top-left to the bottom-right */
    GradientOrientation[GradientOrientation["TL_BR"] = 7] = "TL_BR";
})(GradientOrientation || (GradientOrientation = {}));

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$3 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TruncateAt;
(function (TruncateAt) {
    TruncateAt[TruncateAt["End"] = 0] = "End";
    TruncateAt[TruncateAt["Middle"] = 1] = "Middle";
    TruncateAt[TruncateAt["Start"] = 2] = "Start";
    TruncateAt[TruncateAt["Clip"] = 3] = "Clip";
})(TruncateAt || (TruncateAt = {}));
let Text = /** @class */ (() => {
    class Text extends View {
    }
    __decorate$3([
        Property,
        __metadata$3("design:type", String)
    ], Text.prototype, "text", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", Color)
    ], Text.prototype, "textColor", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", Number)
    ], Text.prototype, "textSize", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", Number)
    ], Text.prototype, "maxLines", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", Gravity)
    ], Text.prototype, "textAlignment", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", String)
    ], Text.prototype, "fontStyle", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", String)
    ], Text.prototype, "font", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", Number)
    ], Text.prototype, "maxWidth", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", Number)
    ], Text.prototype, "maxHeight", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", Number)
    ], Text.prototype, "lineSpacing", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", Boolean)
    ], Text.prototype, "strikethrough", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", Boolean)
    ], Text.prototype, "underline", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", String)
    ], Text.prototype, "htmlText", void 0);
    __decorate$3([
        Property,
        __metadata$3("design:type", Number)
    ], Text.prototype, "truncateAt", void 0);
    return Text;
})();

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$4 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ScaleType;
(function (ScaleType) {
    ScaleType[ScaleType["ScaleToFill"] = 0] = "ScaleToFill";
    ScaleType[ScaleType["ScaleAspectFit"] = 1] = "ScaleAspectFit";
    ScaleType[ScaleType["ScaleAspectFill"] = 2] = "ScaleAspectFill";
})(ScaleType || (ScaleType = {}));
let Image = /** @class */ (() => {
    class Image extends View {
    }
    __decorate$4([
        Property,
        __metadata$4("design:type", String)
    ], Image.prototype, "imageUrl", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", String)
    ], Image.prototype, "imagePath", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", String)
    ], Image.prototype, "imageRes", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", String)
    ], Image.prototype, "imageBase64", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", Number)
    ], Image.prototype, "scaleType", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", Boolean)
    ], Image.prototype, "isBlur", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", String)
    ], Image.prototype, "placeHolderImage", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", String)
    ], Image.prototype, "placeHolderImageBase64", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", Color
        /**
         * Display while image is failed to load
         * It can be file name in local path
         */
        )
    ], Image.prototype, "placeHolderColor", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", String)
    ], Image.prototype, "errorImage", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", String)
    ], Image.prototype, "errorImageBase64", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", Color)
    ], Image.prototype, "errorColor", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", Function)
    ], Image.prototype, "loadCallback", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", Number)
    ], Image.prototype, "imageScale", void 0);
    __decorate$4([
        Property,
        __metadata$4("design:type", Object)
    ], Image.prototype, "stretchInset", void 0);
    return Image;
})();

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
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$5 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let ListItem = /** @class */ (() => {
    class ListItem extends Stack {
    }
    __decorate$5([
        Property,
        __metadata$5("design:type", String)
    ], ListItem.prototype, "identifier", void 0);
    return ListItem;
})();
let List = /** @class */ (() => {
    class List extends Superview {
        constructor() {
            super(...arguments);
            this.cachedViews = new Map;
            this.ignoreDirtyCallOnce = false;
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
    __decorate$5([
        Property,
        __metadata$5("design:type", Object)
    ], List.prototype, "itemCount", void 0);
    __decorate$5([
        Property,
        __metadata$5("design:type", Function)
    ], List.prototype, "renderItem", void 0);
    __decorate$5([
        Property,
        __metadata$5("design:type", Object)
    ], List.prototype, "batchCount", void 0);
    __decorate$5([
        Property,
        __metadata$5("design:type", Function)
    ], List.prototype, "onLoadMore", void 0);
    __decorate$5([
        Property,
        __metadata$5("design:type", Boolean)
    ], List.prototype, "loadMore", void 0);
    __decorate$5([
        Property,
        __metadata$5("design:type", ListItem)
    ], List.prototype, "loadMoreView", void 0);
    __decorate$5([
        Property,
        __metadata$5("design:type", Function)
    ], List.prototype, "onScroll", void 0);
    __decorate$5([
        Property,
        __metadata$5("design:type", Function)
    ], List.prototype, "onScrollEnd", void 0);
    __decorate$5([
        Property,
        __metadata$5("design:type", Number)
    ], List.prototype, "scrolledPosition", void 0);
    return List;
})();

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$6 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let SlideItem = /** @class */ (() => {
    class SlideItem extends Stack {
    }
    __decorate$6([
        Property,
        __metadata$6("design:type", String)
    ], SlideItem.prototype, "identifier", void 0);
    return SlideItem;
})();
let Slider = /** @class */ (() => {
    class Slider extends Superview {
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
            let view = this.renderPage(itemIdx);
            view.superview = this;
            this.cachedViews.set(`${itemIdx}`, view);
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
    __decorate$6([
        Property,
        __metadata$6("design:type", Object)
    ], Slider.prototype, "itemCount", void 0);
    __decorate$6([
        Property,
        __metadata$6("design:type", Function)
    ], Slider.prototype, "renderPage", void 0);
    __decorate$6([
        Property,
        __metadata$6("design:type", Object)
    ], Slider.prototype, "batchCount", void 0);
    __decorate$6([
        Property,
        __metadata$6("design:type", Function)
    ], Slider.prototype, "onPageSlided", void 0);
    __decorate$6([
        Property,
        __metadata$6("design:type", Boolean)
    ], Slider.prototype, "loop", void 0);
    return Slider;
})();

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$7 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let Scroller = /** @class */ (() => {
    class Scroller extends Superview {
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
    }
    __decorate$7([
        Property,
        __metadata$7("design:type", Object)
    ], Scroller.prototype, "contentOffset", void 0);
    __decorate$7([
        Property,
        __metadata$7("design:type", Function)
    ], Scroller.prototype, "onScroll", void 0);
    __decorate$7([
        Property,
        __metadata$7("design:type", Function)
    ], Scroller.prototype, "onScrollEnd", void 0);
    return Scroller;
})();

var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$8 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let Refreshable = /** @class */ (() => {
    class Refreshable extends Superview {
        allSubviews() {
            const ret = [this.content];
            if (this.header) {
                ret.push(this.header);
            }
            return ret;
        }
        setRefreshable(context, refreshable) {
            return this.nativeChannel(context, 'setRefreshable')(refreshable);
        }
        setRefreshing(context, refreshing) {
            return this.nativeChannel(context, 'setRefreshing')(refreshing);
        }
        isRefreshable(context) {
            return this.nativeChannel(context, 'isRefreshable')();
        }
        isRefreshing(context) {
            return this.nativeChannel(context, 'isRefreshing')();
        }
        toModel() {
            this.dirtyProps.content = this.content.viewId;
            this.dirtyProps.header = (this.header || {}).viewId;
            return super.toModel();
        }
    }
    __decorate$8([
        Property,
        __metadata$8("design:type", Function)
    ], Refreshable.prototype, "onRefresh", void 0);
    return Refreshable;
})();

var ValueType;
(function (ValueType) {
    ValueType[ValueType["Undefined"] = 0] = "Undefined";
    ValueType[ValueType["Point"] = 1] = "Point";
    ValueType[ValueType["Percent"] = 2] = "Percent";
    ValueType[ValueType["Auto"] = 3] = "Auto";
})(ValueType || (ValueType = {}));
let FlexTypedValue = /** @class */ (() => {
    class FlexTypedValue {
        constructor(type) {
            this.value = 0;
            this.type = type;
        }
        static percent(v) {
            const ret = new FlexTypedValue(ValueType.Percent);
            ret.value = v;
            return ret;
        }
        static point(v) {
            const ret = new FlexTypedValue(ValueType.Point);
            ret.value = v;
            return ret;
        }
        toModel() {
            return {
                type: this.type,
                value: this.value,
            };
        }
    }
    FlexTypedValue.Auto = new FlexTypedValue(ValueType.Auto);
    return FlexTypedValue;
})();
var FlexDirection;
(function (FlexDirection) {
    FlexDirection[FlexDirection["COLUMN"] = 0] = "COLUMN";
    FlexDirection[FlexDirection["COLUMN_REVERSE"] = 1] = "COLUMN_REVERSE";
    FlexDirection[FlexDirection["ROW"] = 2] = "ROW";
    FlexDirection[FlexDirection["ROW_REVERSE"] = 3] = "ROW_REVERSE";
})(FlexDirection || (FlexDirection = {}));
var Align;
(function (Align) {
    Align[Align["AUTO"] = 0] = "AUTO";
    Align[Align["FLEX_START"] = 1] = "FLEX_START";
    Align[Align["CENTER"] = 2] = "CENTER";
    Align[Align["FLEX_END"] = 3] = "FLEX_END";
    Align[Align["STRETCH"] = 4] = "STRETCH";
    Align[Align["BASELINE"] = 5] = "BASELINE";
    Align[Align["SPACE_BETWEEN"] = 6] = "SPACE_BETWEEN";
    Align[Align["SPACE_AROUND"] = 7] = "SPACE_AROUND";
})(Align || (Align = {}));
var Justify;
(function (Justify) {
    Justify[Justify["FLEX_START"] = 0] = "FLEX_START";
    Justify[Justify["CENTER"] = 1] = "CENTER";
    Justify[Justify["FLEX_END"] = 2] = "FLEX_END";
    Justify[Justify["SPACE_BETWEEN"] = 3] = "SPACE_BETWEEN";
    Justify[Justify["SPACE_AROUND"] = 4] = "SPACE_AROUND";
    Justify[Justify["SPACE_EVENLY"] = 5] = "SPACE_EVENLY";
})(Justify || (Justify = {}));
var Direction;
(function (Direction) {
    Direction[Direction["INHERIT"] = 0] = "INHERIT";
    Direction[Direction["LTR"] = 1] = "LTR";
    Direction[Direction["RTL"] = 2] = "RTL";
})(Direction || (Direction = {}));
var PositionType;
(function (PositionType) {
    PositionType[PositionType["RELATIVE"] = 0] = "RELATIVE";
    PositionType[PositionType["ABSOLUTE"] = 1] = "ABSOLUTE";
})(PositionType || (PositionType = {}));
var Wrap;
(function (Wrap) {
    Wrap[Wrap["NO_WRAP"] = 0] = "NO_WRAP";
    Wrap[Wrap["WRAP"] = 1] = "WRAP";
    Wrap[Wrap["WRAP_REVERSE"] = 2] = "WRAP_REVERSE";
})(Wrap || (Wrap = {}));
var OverFlow;
(function (OverFlow) {
    OverFlow[OverFlow["VISIBLE"] = 0] = "VISIBLE";
    OverFlow[OverFlow["HIDDEN"] = 1] = "HIDDEN";
    OverFlow[OverFlow["SCROLL"] = 2] = "SCROLL";
})(OverFlow || (OverFlow = {}));
var Display;
(function (Display) {
    Display[Display["FLEX"] = 0] = "FLEX";
    Display[Display["NONE"] = 1] = "NONE";
})(Display || (Display = {}));

var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$9 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let FlowLayoutItem = /** @class */ (() => {
    class FlowLayoutItem extends Stack {
    }
    __decorate$9([
        Property,
        __metadata$9("design:type", String)
    ], FlowLayoutItem.prototype, "identifier", void 0);
    return FlowLayoutItem;
})();
let FlowLayout = /** @class */ (() => {
    class FlowLayout extends Superview {
        constructor() {
            super(...arguments);
            this.cachedViews = new Map;
            this.ignoreDirtyCallOnce = false;
            this.columnCount = 2;
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
    __decorate$9([
        Property,
        __metadata$9("design:type", Object)
    ], FlowLayout.prototype, "columnCount", void 0);
    __decorate$9([
        Property,
        __metadata$9("design:type", Number)
    ], FlowLayout.prototype, "columnSpace", void 0);
    __decorate$9([
        Property,
        __metadata$9("design:type", Number)
    ], FlowLayout.prototype, "rowSpace", void 0);
    __decorate$9([
        Property,
        __metadata$9("design:type", Object)
    ], FlowLayout.prototype, "itemCount", void 0);
    __decorate$9([
        Property,
        __metadata$9("design:type", Function)
    ], FlowLayout.prototype, "renderItem", void 0);
    __decorate$9([
        Property,
        __metadata$9("design:type", Object)
    ], FlowLayout.prototype, "batchCount", void 0);
    __decorate$9([
        Property,
        __metadata$9("design:type", Function)
    ], FlowLayout.prototype, "onLoadMore", void 0);
    __decorate$9([
        Property,
        __metadata$9("design:type", Boolean)
    ], FlowLayout.prototype, "loadMore", void 0);
    __decorate$9([
        Property,
        __metadata$9("design:type", FlowLayoutItem)
    ], FlowLayout.prototype, "loadMoreView", void 0);
    __decorate$9([
        Property,
        __metadata$9("design:type", Function)
    ], FlowLayout.prototype, "onScroll", void 0);
    __decorate$9([
        Property,
        __metadata$9("design:type", Function)
    ], FlowLayout.prototype, "onScrollEnd", void 0);
    return FlowLayout;
})();

var __decorate$a = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$a = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let Input = /** @class */ (() => {
    class Input extends View {
        getText(context) {
            return this.nativeChannel(context, 'getText')();
        }
        setSelection(context, start, end = start) {
            return this.nativeChannel(context, 'setSelection')({
                start,
                end,
            });
        }
        requestFocus(context) {
            return this.nativeChannel(context, 'requestFocus')();
        }
        releaseFocus(context) {
            return this.nativeChannel(context, 'releaseFocus')();
        }
    }
    __decorate$a([
        Property,
        __metadata$a("design:type", String)
    ], Input.prototype, "text", void 0);
    __decorate$a([
        Property,
        __metadata$a("design:type", Color)
    ], Input.prototype, "textColor", void 0);
    __decorate$a([
        Property,
        __metadata$a("design:type", Number)
    ], Input.prototype, "textSize", void 0);
    __decorate$a([
        Property,
        __metadata$a("design:type", String)
    ], Input.prototype, "hintText", void 0);
    __decorate$a([
        Property,
        __metadata$a("design:type", Color)
    ], Input.prototype, "hintTextColor", void 0);
    __decorate$a([
        Property,
        __metadata$a("design:type", Boolean)
    ], Input.prototype, "multiline", void 0);
    __decorate$a([
        Property,
        __metadata$a("design:type", Gravity)
    ], Input.prototype, "textAlignment", void 0);
    __decorate$a([
        Property,
        __metadata$a("design:type", Function)
    ], Input.prototype, "onTextChange", void 0);
    __decorate$a([
        Property,
        __metadata$a("design:type", Function)
    ], Input.prototype, "onFocusChange", void 0);
    __decorate$a([
        Property,
        __metadata$a("design:type", Number)
    ], Input.prototype, "maxLength", void 0);
    return Input;
})();

var __decorate$b = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$b = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let NestedSlider = /** @class */ (() => {
    class NestedSlider extends Group {
        addSlideItem(view) {
            this.addChild(view);
        }
        slidePage(context, page, smooth = false) {
            return this.nativeChannel(context, "slidePage")({ page, smooth });
        }
        getSlidedPage(context) {
            return this.nativeChannel(context, "getSlidedPage")();
        }
    }
    __decorate$b([
        Property,
        __metadata$b("design:type", Function)
    ], NestedSlider.prototype, "onPageSlided", void 0);
    return NestedSlider;
})();

var __decorate$c = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$c = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let Draggable = /** @class */ (() => {
    class Draggable extends Stack {
    }
    __decorate$c([
        Property,
        __metadata$c("design:type", Function)
    ], Draggable.prototype, "onDrag", void 0);
    return Draggable;
})();

var __decorate$d = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$d = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let Switch = /** @class */ (() => {
    class Switch extends View {
    }
    __decorate$d([
        Property,
        __metadata$d("design:type", Boolean)
    ], Switch.prototype, "state", void 0);
    __decorate$d([
        Property,
        __metadata$d("design:type", Function)
    ], Switch.prototype, "onSwitch", void 0);
    __decorate$d([
        Property,
        __metadata$d("design:type", Color)
    ], Switch.prototype, "offTintColor", void 0);
    __decorate$d([
        Property,
        __metadata$d("design:type", Color)
    ], Switch.prototype, "onTintColor", void 0);
    __decorate$d([
        Property,
        __metadata$d("design:type", Color)
    ], Switch.prototype, "thumbTintColor", void 0);
    return Switch;
})();

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var StatusBarMode;
(function (StatusBarMode) {
    StatusBarMode[StatusBarMode["LIGHT"] = 0] = "LIGHT";
    StatusBarMode[StatusBarMode["DARK"] = 1] = "DARK";
})(StatusBarMode || (StatusBarMode = {}));

Object.keys(reflectMetadata).forEach(function (k) {
    if (k !== 'default') Object.defineProperty(exports, k, {
        enumerable: true,
        get: function () {
            return reflectMetadata[k];
        }
    });
});
Object.defineProperty(exports, 'Align', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Align;
    }
});
Object.defineProperty(exports, 'AnimationSet', {
    enumerable: true,
    get: function () {
        return reflectMetadata.AnimationSet;
    }
});
Object.defineProperty(exports, 'BOTTOM', {
    enumerable: true,
    get: function () {
        return reflectMetadata.BOTTOM;
    }
});
Object.defineProperty(exports, 'CENTER', {
    enumerable: true,
    get: function () {
        return reflectMetadata.CENTER;
    }
});
Object.defineProperty(exports, 'CENTER_X', {
    enumerable: true,
    get: function () {
        return reflectMetadata.CENTER_X;
    }
});
Object.defineProperty(exports, 'CENTER_Y', {
    enumerable: true,
    get: function () {
        return reflectMetadata.CENTER_Y;
    }
});
Object.defineProperty(exports, 'Color', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Color;
    }
});
Object.defineProperty(exports, 'Direction', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Direction;
    }
});
Object.defineProperty(exports, 'Display', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Display;
    }
});
Object.defineProperty(exports, 'Draggable', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Draggable;
    }
});
Object.defineProperty(exports, 'FillMode', {
    enumerable: true,
    get: function () {
        return reflectMetadata.FillMode;
    }
});
Object.defineProperty(exports, 'FlexDirection', {
    enumerable: true,
    get: function () {
        return reflectMetadata.FlexDirection;
    }
});
Object.defineProperty(exports, 'FlexLayout', {
    enumerable: true,
    get: function () {
        return reflectMetadata.FlexLayout;
    }
});
Object.defineProperty(exports, 'FlexTypedValue', {
    enumerable: true,
    get: function () {
        return reflectMetadata.FlexTypedValue;
    }
});
Object.defineProperty(exports, 'FlowLayout', {
    enumerable: true,
    get: function () {
        return reflectMetadata.FlowLayout;
    }
});
Object.defineProperty(exports, 'FlowLayoutItem', {
    enumerable: true,
    get: function () {
        return reflectMetadata.FlowLayoutItem;
    }
});
Object.defineProperty(exports, 'GradientOrientation', {
    enumerable: true,
    get: function () {
        return reflectMetadata.GradientOrientation;
    }
});
Object.defineProperty(exports, 'Gravity', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Gravity;
    }
});
Object.defineProperty(exports, 'Group', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Group;
    }
});
Object.defineProperty(exports, 'HLayout', {
    enumerable: true,
    get: function () {
        return reflectMetadata.HLayout;
    }
});
Object.defineProperty(exports, 'Image', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Image;
    }
});
Object.defineProperty(exports, 'Input', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Input;
    }
});
Object.defineProperty(exports, 'Justify', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Justify;
    }
});
Object.defineProperty(exports, 'LEFT', {
    enumerable: true,
    get: function () {
        return reflectMetadata.LEFT;
    }
});
Object.defineProperty(exports, 'LayoutConfigImpl', {
    enumerable: true,
    get: function () {
        return reflectMetadata.LayoutConfigImpl;
    }
});
Object.defineProperty(exports, 'LayoutSpec', {
    enumerable: true,
    get: function () {
        return reflectMetadata.LayoutSpec;
    }
});
Object.defineProperty(exports, 'List', {
    enumerable: true,
    get: function () {
        return reflectMetadata.List;
    }
});
Object.defineProperty(exports, 'ListItem', {
    enumerable: true,
    get: function () {
        return reflectMetadata.ListItem;
    }
});
Object.defineProperty(exports, 'Mutable', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Mutable;
    }
});
Object.defineProperty(exports, 'NativeCall', {
    enumerable: true,
    get: function () {
        return reflectMetadata.NativeCall;
    }
});
Object.defineProperty(exports, 'NestedSlider', {
    enumerable: true,
    get: function () {
        return reflectMetadata.NestedSlider;
    }
});
Object.defineProperty(exports, 'Observable', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Observable;
    }
});
Object.defineProperty(exports, 'OverFlow', {
    enumerable: true,
    get: function () {
        return reflectMetadata.OverFlow;
    }
});
Object.defineProperty(exports, 'Panel', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Panel;
    }
});
Object.defineProperty(exports, 'PositionType', {
    enumerable: true,
    get: function () {
        return reflectMetadata.PositionType;
    }
});
Object.defineProperty(exports, 'Property', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Property;
    }
});
Object.defineProperty(exports, 'Provider', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Provider;
    }
});
Object.defineProperty(exports, 'RIGHT', {
    enumerable: true,
    get: function () {
        return reflectMetadata.RIGHT;
    }
});
Object.defineProperty(exports, 'Refreshable', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Refreshable;
    }
});
Object.defineProperty(exports, 'RepeatMode', {
    enumerable: true,
    get: function () {
        return reflectMetadata.RepeatMode;
    }
});
Object.defineProperty(exports, 'Root', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Root;
    }
});
Object.defineProperty(exports, 'RotationAnimation', {
    enumerable: true,
    get: function () {
        return reflectMetadata.RotationAnimation;
    }
});
Object.defineProperty(exports, 'ScaleAnimation', {
    enumerable: true,
    get: function () {
        return reflectMetadata.ScaleAnimation;
    }
});
Object.defineProperty(exports, 'ScaleType', {
    enumerable: true,
    get: function () {
        return reflectMetadata.ScaleType;
    }
});
Object.defineProperty(exports, 'Scroller', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Scroller;
    }
});
Object.defineProperty(exports, 'SlideItem', {
    enumerable: true,
    get: function () {
        return reflectMetadata.SlideItem;
    }
});
Object.defineProperty(exports, 'Slider', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Slider;
    }
});
Object.defineProperty(exports, 'Stack', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Stack;
    }
});
Object.defineProperty(exports, 'StatusBarMode', {
    enumerable: true,
    get: function () {
        return reflectMetadata.StatusBarMode;
    }
});
Object.defineProperty(exports, 'Superview', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Superview;
    }
});
Object.defineProperty(exports, 'Switch', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Switch;
    }
});
Object.defineProperty(exports, 'TOP', {
    enumerable: true,
    get: function () {
        return reflectMetadata.TOP;
    }
});
Object.defineProperty(exports, 'Text', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Text;
    }
});
Object.defineProperty(exports, 'TimingFunction', {
    enumerable: true,
    get: function () {
        return reflectMetadata.TimingFunction;
    }
});
Object.defineProperty(exports, 'TranslationAnimation', {
    enumerable: true,
    get: function () {
        return reflectMetadata.TranslationAnimation;
    }
});
Object.defineProperty(exports, 'TruncateAt', {
    enumerable: true,
    get: function () {
        return reflectMetadata.TruncateAt;
    }
});
Object.defineProperty(exports, 'VLayout', {
    enumerable: true,
    get: function () {
        return reflectMetadata.VLayout;
    }
});
Object.defineProperty(exports, 'VMPanel', {
    enumerable: true,
    get: function () {
        return reflectMetadata.VMPanel;
    }
});
Object.defineProperty(exports, 'View', {
    enumerable: true,
    get: function () {
        return reflectMetadata.View;
    }
});
Object.defineProperty(exports, 'ViewHolder', {
    enumerable: true,
    get: function () {
        return reflectMetadata.ViewHolder;
    }
});
Object.defineProperty(exports, 'ViewModel', {
    enumerable: true,
    get: function () {
        return reflectMetadata.ViewModel;
    }
});
Object.defineProperty(exports, 'Wrap', {
    enumerable: true,
    get: function () {
        return reflectMetadata.Wrap;
    }
});
Object.defineProperty(exports, 'animate', {
    enumerable: true,
    get: function () {
        return reflectMetadata.animate;
    }
});
Object.defineProperty(exports, 'coordinator', {
    enumerable: true,
    get: function () {
        return reflectMetadata.coordinator;
    }
});
Object.defineProperty(exports, 'draggable', {
    enumerable: true,
    get: function () {
        return reflectMetadata.draggable;
    }
});
Object.defineProperty(exports, 'flexlayout', {
    enumerable: true,
    get: function () {
        return reflectMetadata.flexlayout;
    }
});
Object.defineProperty(exports, 'flowItem', {
    enumerable: true,
    get: function () {
        return reflectMetadata.flowItem;
    }
});
Object.defineProperty(exports, 'flowlayout', {
    enumerable: true,
    get: function () {
        return reflectMetadata.flowlayout;
    }
});
Object.defineProperty(exports, 'gravity', {
    enumerable: true,
    get: function () {
        return reflectMetadata.gravity;
    }
});
Object.defineProperty(exports, 'hlayout', {
    enumerable: true,
    get: function () {
        return reflectMetadata.hlayout;
    }
});
Object.defineProperty(exports, 'image', {
    enumerable: true,
    get: function () {
        return reflectMetadata.image;
    }
});
Object.defineProperty(exports, 'input', {
    enumerable: true,
    get: function () {
        return reflectMetadata.input;
    }
});
Object.defineProperty(exports, 'layoutConfig', {
    enumerable: true,
    get: function () {
        return reflectMetadata.layoutConfig;
    }
});
Object.defineProperty(exports, 'list', {
    enumerable: true,
    get: function () {
        return reflectMetadata.list;
    }
});
Object.defineProperty(exports, 'listItem', {
    enumerable: true,
    get: function () {
        return reflectMetadata.listItem;
    }
});
Object.defineProperty(exports, 'log', {
    enumerable: true,
    get: function () {
        return reflectMetadata.log;
    }
});
Object.defineProperty(exports, 'loge', {
    enumerable: true,
    get: function () {
        return reflectMetadata.loge;
    }
});
Object.defineProperty(exports, 'logw', {
    enumerable: true,
    get: function () {
        return reflectMetadata.logw;
    }
});
Object.defineProperty(exports, 'modal', {
    enumerable: true,
    get: function () {
        return reflectMetadata.modal;
    }
});
Object.defineProperty(exports, 'navbar', {
    enumerable: true,
    get: function () {
        return reflectMetadata.navbar;
    }
});
Object.defineProperty(exports, 'navigator', {
    enumerable: true,
    get: function () {
        return reflectMetadata.navigator;
    }
});
Object.defineProperty(exports, 'network', {
    enumerable: true,
    get: function () {
        return reflectMetadata.network;
    }
});
Object.defineProperty(exports, 'notch', {
    enumerable: true,
    get: function () {
        return reflectMetadata.notch;
    }
});
Object.defineProperty(exports, 'notification', {
    enumerable: true,
    get: function () {
        return reflectMetadata.notification;
    }
});
Object.defineProperty(exports, 'obj2Model', {
    enumerable: true,
    get: function () {
        return reflectMetadata.obj2Model;
    }
});
Object.defineProperty(exports, 'popover', {
    enumerable: true,
    get: function () {
        return reflectMetadata.popover;
    }
});
Object.defineProperty(exports, 'pullable', {
    enumerable: true,
    get: function () {
        return reflectMetadata.pullable;
    }
});
Object.defineProperty(exports, 'refreshable', {
    enumerable: true,
    get: function () {
        return reflectMetadata.refreshable;
    }
});
Object.defineProperty(exports, 'repeat', {
    enumerable: true,
    get: function () {
        return reflectMetadata.repeat;
    }
});
Object.defineProperty(exports, 'scroller', {
    enumerable: true,
    get: function () {
        return reflectMetadata.scroller;
    }
});
Object.defineProperty(exports, 'slideItem', {
    enumerable: true,
    get: function () {
        return reflectMetadata.slideItem;
    }
});
Object.defineProperty(exports, 'slider', {
    enumerable: true,
    get: function () {
        return reflectMetadata.slider;
    }
});
Object.defineProperty(exports, 'stack', {
    enumerable: true,
    get: function () {
        return reflectMetadata.stack;
    }
});
Object.defineProperty(exports, 'statusbar', {
    enumerable: true,
    get: function () {
        return reflectMetadata.statusbar;
    }
});
Object.defineProperty(exports, 'storage', {
    enumerable: true,
    get: function () {
        return reflectMetadata.storage;
    }
});
Object.defineProperty(exports, 'switchView', {
    enumerable: true,
    get: function () {
        return reflectMetadata.switchView;
    }
});
Object.defineProperty(exports, 'take', {
    enumerable: true,
    get: function () {
        return reflectMetadata.take;
    }
});
Object.defineProperty(exports, 'takeAlso', {
    enumerable: true,
    get: function () {
        return reflectMetadata.takeAlso;
    }
});
Object.defineProperty(exports, 'takeIf', {
    enumerable: true,
    get: function () {
        return reflectMetadata.takeIf;
    }
});
Object.defineProperty(exports, 'takeLet', {
    enumerable: true,
    get: function () {
        return reflectMetadata.takeLet;
    }
});
Object.defineProperty(exports, 'takeNonNull', {
    enumerable: true,
    get: function () {
        return reflectMetadata.takeNonNull;
    }
});
Object.defineProperty(exports, 'takeNull', {
    enumerable: true,
    get: function () {
        return reflectMetadata.takeNull;
    }
});
Object.defineProperty(exports, 'takeUnless', {
    enumerable: true,
    get: function () {
        return reflectMetadata.takeUnless;
    }
});
Object.defineProperty(exports, 'text', {
    enumerable: true,
    get: function () {
        return reflectMetadata.text;
    }
});
Object.defineProperty(exports, 'uniqueId', {
    enumerable: true,
    get: function () {
        return reflectMetadata.uniqueId;
    }
});
Object.defineProperty(exports, 'vlayout', {
    enumerable: true,
    get: function () {
        return reflectMetadata.vlayout;
    }
});
