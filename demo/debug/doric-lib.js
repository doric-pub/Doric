'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 *  Store color as format AARRGGBB or RRGGBB
 */
class Color {
    constructor(v) {
        this._value = 0;
        this._value = v;
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
    toModel() {
        return this._value;
    }
}
Color.TRANSPARENT = new Color(0);
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
})(exports.GradientOrientation || (exports.GradientOrientation = {}));

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
class Mutable {
    constructor(v) {
        this.binders = new Set;
        this.get = () => {
            return this.val;
        };
        this.set = (v) => {
            this.val = v;
            this.binders.forEach(e => {
                Reflect.apply(e, undefined, [this.val]);
            });
        };
        this.val = v;
    }
    bind(binder) {
        this.binders.add(binder);
        Reflect.apply(binder, undefined, [this.val]);
    }
    static of(v) {
        return new Mutable(v);
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
class Gravity {
    constructor() {
        this.val = 0;
    }
    left() {
        this.val |= LEFT;
        return this;
    }
    right() {
        this.val |= RIGHT;
        return this;
    }
    top() {
        this.val |= TOP;
        return this;
    }
    bottom() {
        this.val |= BOTTOM;
        return this;
    }
    center() {
        this.val |= CENTER;
        return this;
    }
    centerX() {
        this.val |= CENTER_X;
        return this;
    }
    centerY() {
        this.val |= CENTER_Y;
        return this;
    }
    toModel() {
        return this.val;
    }
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
function log(...args) {
    let out = "";
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ',';
        }
        out += toString(arguments[i]);
    }
    nativeLog('d', out);
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
function logw(...message) {
    let out = "";
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ',';
        }
        out += toString(arguments[i]);
    }
    nativeLog('w', out);
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
const MATCH_PARENT = -1;
const WRAP_CONTENT = -2;
function Property(target, propKey) {
    Reflect.defineMetadata(propKey, true, target);
}
class View {
    constructor() {
        this.width = WRAP_CONTENT;
        this.height = WRAP_CONTENT;
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
        const f = this.callbacks.get(id);
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
    onPropertyChanged(propKey, oldV, newV) {
        if (newV instanceof Function) {
            newV = this.callback2Id(newV);
        }
        else {
            newV = obj2Model(newV);
        }
        this.__dirty_props__[propKey] = newV;
        if (this.parent instanceof Group) {
            this.parent.onChildPropertyChanged(this);
        }
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
            Reflect.apply(f, this, argumentsList);
        }
        else {
            loge(`Cannot find callback:${id} for ${JSON.stringify(this.toModel())}`);
        }
    }
    toModel() {
        return this.nativeViewModel;
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
], View.prototype, "bgColor", void 0);
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
], View.prototype, "viewId", void 0);
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
class Group extends View {
    constructor() {
        super(...arguments);
        this.children = new Proxy([], {
            set: (target, index, value) => {
                if (index === 'length') {
                    this.getDirtyChildrenModel().length = value;
                }
                else if (typeof index === 'string'
                    && parseInt(index) >= 0
                    && value instanceof View) {
                    value.parent = this;
                    const childrenModel = this.getDirtyChildrenModel();
                    childrenModel[parseInt(index)] = value.nativeViewModel;
                }
                if (this.parent) {
                    this.parent.onChildPropertyChanged(this);
                }
                return Reflect.set(target, index, value);
            }
        });
    }
    addChild(view) {
        this.children.push(view);
    }
    clean() {
        this.children.forEach(e => { e.clean(); });
        super.clean();
    }
    getDirtyChildrenModel() {
        if (this.__dirty_props__.children === undefined) {
            this.__dirty_props__.children = [];
        }
        return this.__dirty_props__.children;
    }
    toModel() {
        if (this.__dirty_props__.children != undefined) {
            this.__dirty_props__.children.length = this.children.length;
        }
        return super.toModel();
    }
    onChildPropertyChanged(child) {
        this.getDirtyChildrenModel()[this.children.indexOf(child)] = child.nativeViewModel;
        this.getDirtyChildrenModel().length = this.children.length;
        if (this.parent) {
            this.parent.onChildPropertyChanged(this);
        }
    }
    isDirty() {
        return super.isDirty();
    }
}
__decorate([
    Property,
    __metadata("design:type", Array)
], Group.prototype, "children", void 0);
class Stack extends Group {
}
__decorate([
    Property,
    __metadata("design:type", Gravity)
], Stack.prototype, "gravity", void 0);
class Root extends Stack {
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
class VLayout extends LinearLayout {
}
class HLayout extends LinearLayout {
}
class Text extends View {
}
__decorate([
    Property,
    __metadata("design:type", String)
], Text.prototype, "text", void 0);
__decorate([
    Property,
    __metadata("design:type", Color)
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
class Image extends View {
}
__decorate([
    Property,
    __metadata("design:type", String)
], Image.prototype, "imageUrl", void 0);
class List extends View {
}
class Slide extends View {
}
function stack() {
}
function vlayout(providers, config) {
    const vlayout = new VLayout;
    vlayout.width = config.width;
    vlayout.height = config.height;
    if (config.space !== undefined) {
        vlayout.space = config.space;
    }
    providers.forEach(e => {
        vlayout.addChild(e());
    });
    return vlayout;
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$1 = (undefined && undefined.__metadata) || function (k, v) {
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
class Panel {
    constructor() {
        this.__root__ = new Root;
    }
    onCreate() { }
    onDestroy() { }
    onShow() { }
    onHidden() { }
    getRootView() {
        return this.__root__;
    }
    getInitData() {
        return this.__data__;
    }
    __init__(frame, data) {
        this.__data__ = data;
        this.__root__.width = frame.width;
        this.__root__.height = frame.height;
        this.build(this.__root__);
    }
    __onCreate__() {
        this.onCreate();
    }
    __onDestroy__() {
        this.onDestroy();
    }
    __onShow__() {
        this.onShow();
    }
    __onHidden__() {
        this.onHidden();
    }
    __build__() {
        this.build(this.__root__);
    }
    __response__(viewIds, callbackId) {
        const v = this.retrospectView(viewIds);
        if (v === undefined) {
            loge(`Cannot find view for ${viewIds}`);
        }
        const argumentsList = [callbackId];
        for (let i = 2; i < arguments.length; i++) {
            argumentsList.push(arguments[i]);
        }
        Reflect.apply(v.responseCallback, v, argumentsList);
    }
    retrospectView(ids) {
        return ids.reduce((acc, cur) => {
            if (acc instanceof Group) {
                return acc.children.filter(e => e.viewId === cur)[0];
            }
            return acc;
        }, this.__root__);
    }
    nativeRender(model) {
        if (this.context) {
            this.context.shader.render(model);
        }
    }
    hookBeforeNativeCall() {
    }
    hookAfterNativeCall() {
        if (this.__root__.isDirty()) {
            const model = this.__root__.toModel();
            this.nativeRender(model);
            this.__root__.clean();
        }
    }
}
__decorate$1([
    NativeCall,
    __metadata$1("design:type", Function),
    __metadata$1("design:paramtypes", [Object, Object]),
    __metadata$1("design:returntype", void 0)
], Panel.prototype, "__init__", null);
__decorate$1([
    NativeCall,
    __metadata$1("design:type", Function),
    __metadata$1("design:paramtypes", []),
    __metadata$1("design:returntype", void 0)
], Panel.prototype, "__onCreate__", null);
__decorate$1([
    NativeCall,
    __metadata$1("design:type", Function),
    __metadata$1("design:paramtypes", []),
    __metadata$1("design:returntype", void 0)
], Panel.prototype, "__onDestroy__", null);
__decorate$1([
    NativeCall,
    __metadata$1("design:type", Function),
    __metadata$1("design:paramtypes", []),
    __metadata$1("design:returntype", void 0)
], Panel.prototype, "__onShow__", null);
__decorate$1([
    NativeCall,
    __metadata$1("design:type", Function),
    __metadata$1("design:paramtypes", []),
    __metadata$1("design:returntype", void 0)
], Panel.prototype, "__onHidden__", null);
__decorate$1([
    NativeCall,
    __metadata$1("design:type", Function),
    __metadata$1("design:paramtypes", []),
    __metadata$1("design:returntype", void 0)
], Panel.prototype, "__build__", null);
__decorate$1([
    NativeCall,
    __metadata$1("design:type", Function),
    __metadata$1("design:paramtypes", [Array, String]),
    __metadata$1("design:returntype", void 0)
], Panel.prototype, "__response__", null);

function listen(obj, listener) {
    return new Proxy(obj, {
        get: (target, prop, receiver) => {
            const ret = Reflect.get(target, prop, receiver);
            if (ret instanceof Function) {
                return Reflect.get(target, prop, receiver);
            }
            else if (ret instanceof Object) {
                return listen(ret, listener);
            }
            else {
                return ret;
            }
        },
        set: (target, prop, value, receiver) => {
            const ret = Reflect.set(target, prop, value, receiver);
            Reflect.apply(listener, undefined, []);
            return ret;
        },
    });
}
class ViewHolder {
}
class VMPanel extends Panel {
    getVM() {
        return this.vm;
    }
    build(root) {
        this.vm = new (this.getVMClass())(this.getModel(), this.getViewHolder());
        this.vm.build(root);
    }
}
class ViewModel {
    constructor(obj, v) {
        this.listeners = [];
        this.model = listen(obj, () => {
            this.listeners.forEach(e => {
                Reflect.apply(e, this.model, [this.model]);
            });
        });
        this.viewHolder = v;
    }
    build(root) {
        this.viewHolder.build(root);
        this.bind((data) => {
            this.binding(this.viewHolder, data);
        });
    }
    getModel() {
        return this.model;
    }
    bind(f) {
        Reflect.apply(f, this.model, [this.model]);
        this.listeners.push(f);
    }
}

exports.BOTTOM = BOTTOM;
exports.CENTER = CENTER;
exports.CENTER_X = CENTER_X;
exports.CENTER_Y = CENTER_Y;
exports.Color = Color;
exports.Gravity = Gravity;
exports.Group = Group;
exports.HLayout = HLayout;
exports.Image = Image;
exports.LEFT = LEFT;
exports.List = List;
exports.MATCH_PARENT = MATCH_PARENT;
exports.Mutable = Mutable;
exports.NativeCall = NativeCall;
exports.Panel = Panel;
exports.Property = Property;
exports.RIGHT = RIGHT;
exports.Root = Root;
exports.Slide = Slide;
exports.Stack = Stack;
exports.TOP = TOP;
exports.Text = Text;
exports.VLayout = VLayout;
exports.VMPanel = VMPanel;
exports.View = View;
exports.ViewHolder = ViewHolder;
exports.ViewModel = ViewModel;
exports.WRAP_CONTENT = WRAP_CONTENT;
exports.log = log;
exports.loge = loge;
exports.logw = logw;
exports.obj2Model = obj2Model;
exports.stack = stack;
exports.vlayout = vlayout;
