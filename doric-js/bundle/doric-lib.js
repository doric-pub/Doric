'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function obj2Model(obj, convertor) {
    if (obj instanceof Function) {
        return convertor(obj);
    }
    else if (obj instanceof Array) {
        return obj.map(e => obj2Model(e, convertor));
    }
    else if (obj instanceof Object) {
        if (Reflect.has(obj, 'toModel') && Reflect.get(obj, 'toModel') instanceof Function) {
            obj = Reflect.apply(Reflect.get(obj, 'toModel'), obj, []);
            return obj;
        }
        else {
            for (let key in obj) {
                const val = Reflect.get(obj, key);
                Reflect.set(obj, key, obj2Model(val, convertor));
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

var __decorate$f = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$f = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const PROP_CONSIST = 1;
const PROP_INCONSIST = 2;
const PROP_KEY_VIEW_TYPE = "ViewType";
function Property(target, propKey) {
    Reflect.defineMetadata(propKey, PROP_CONSIST, target);
}
function InconsistProperty(target, propKey) {
    Reflect.defineMetadata(propKey, PROP_INCONSIST, target);
}
function ViewComponent(constructor) {
    const name = Reflect.getMetadata(PROP_KEY_VIEW_TYPE, constructor) || Object.getPrototypeOf(constructor).name;
    Reflect.defineMetadata(PROP_KEY_VIEW_TYPE, name, constructor);
}
class Ref {
    set current(v) {
        this.view = v;
    }
    get current() {
        if (!!!this.view) {
            throw new Error("Ref is empty");
        }
        return this.view;
    }
    apply(config) {
        if (this.view) {
            this.view.apply(config);
        }
    }
}
function createRef() {
    return new Ref;
}
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
            type: this.viewType(),
            props: this.__dirty_props__,
        };
        return new Proxy(this, {
            get: (target, p, receiver) => {
                return Reflect.get(target, p, receiver);
            },
            set: (target, p, v, receiver) => {
                const oldV = Reflect.get(target, p, receiver);
                const ret = Reflect.set(target, p, v, receiver);
                if (Reflect.getMetadata(p, target) === PROP_CONSIST && oldV !== v) {
                    receiver.onPropertyChanged(p.toString(), oldV, v);
                }
                else if (Reflect.getMetadata(p, target) === PROP_INCONSIST) {
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
    findViewByTag(tag) {
        if (tag === this.tag) {
            return this;
        }
        return undefined;
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
    viewType() {
        const viewType = Reflect.getMetadata(PROP_KEY_VIEW_TYPE, this.constructor);
        return viewType || this.constructor.name;
    }
    onPropertyChanged(propKey, oldV, newV) {
        if (newV instanceof Function) {
            newV = this.callback2Id(newV);
        }
        else {
            newV = obj2Model(newV, (v) => this.callback2Id(v));
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
    set props(props) {
        this.apply(props);
    }
    set parent(v) {
        this.in(v);
    }
    set ref(ref) {
        ref.current = this;
    }
    doAnimation(context, animation) {
        return this.nativeChannel(context, "doAnimation")(animation.toModel()).then((args) => {
            for (let key in args) {
                Reflect.set(this, key, Reflect.get(args, key, args), this);
                Reflect.deleteProperty(this.__dirty_props__, key);
            }
        });
    }
    clearAnimation(context, animation) {
        return this.nativeChannel(context, "clearAnimation")(animation.id).then(() => {
            this.__dirty_props__.translationX = this.translationX || 0;
            this.__dirty_props__.translationY = this.translationY || 0;
            this.__dirty_props__.scaleX = this.scaleX || 1;
            this.__dirty_props__.scaleY = this.scaleY || 1;
            this.__dirty_props__.rotation = this.rotation || 0;
        });
    }
    cancelAnimation(context, animation) {
        return this.nativeChannel(context, "cancelAnimation")(animation.id).then((args) => {
            for (let key in args) {
                Reflect.set(this, key, Reflect.get(args, key, args), this);
                Reflect.deleteProperty(this.__dirty_props__, key);
            }
        });
    }
}
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "width", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "height", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "x", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "y", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Object)
], View.prototype, "backgroundColor", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Object)
], View.prototype, "corners", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Object)
], View.prototype, "border", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Object)
], View.prototype, "shadow", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "alpha", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Boolean)
], View.prototype, "hidden", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Object)
], View.prototype, "padding", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Object)
], View.prototype, "layoutConfig", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Function)
], View.prototype, "onClick", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "translationX", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "translationY", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "scaleX", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "scaleY", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "pivotX", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "pivotY", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "rotation", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "rotationX", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "rotationY", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Number)
], View.prototype, "perspective", void 0);
__decorate$f([
    Property,
    __metadata$f("design:type", Object)
], View.prototype, "flexConfig", void 0);
class Superview extends View {
    subviewById(id) {
        for (let v of this.allSubviews()) {
            if (v.viewId === id) {
                return v;
            }
        }
    }
    findViewByTag(tag) {
        if (tag === this.tag) {
            return this;
        }
        return this.findViewTraversal(this, tag);
    }
    findViewTraversal(view, tag) {
        for (let v of view.allSubviews()) {
            let find = v.findViewByTag(tag);
            if (find) {
                return find;
            }
        }
        return undefined;
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
                if (v.superview && v.superview !== this) {
                    //It had been added to another view, need to be marked totally
                    for (let key in v) {
                        if (Reflect.getMetadata(key, v) === PROP_CONSIST || Reflect.getMetadata(key, v) === PROP_INCONSIST) {
                            v.onPropertyChanged(key, undefined, Reflect.get(v, key));
                        }
                        if (v instanceof Superview) {
                            for (const subview of v.allSubviews()) {
                                subview.superview = {};
                            }
                        }
                        if (v instanceof Group) {
                            v.dirtyProps.children = v.children.map(e => e.viewId);
                        }
                    }
                }
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
                this.dirtyProps.children = target.map(e => e.viewId);
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
    removeChild(view) {
        const ret = this.children.filter(e => e !== view);
        this.children.length = 0;
        ret.forEach(e => this.addChild(e));
    }
    removeAllChildren() {
        this.children.length = 0;
    }
    addInnerElement(e) {
        if (e instanceof Array) {
            e.forEach(e => this.addInnerElement(e));
        }
        else if (e instanceof View) {
            this.addChild(e);
        }
        else {
            loge(`Not allowed to add ${typeof e}`);
        }
    }
    set innerElement(e) {
        this.addInnerElement(e);
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
function gravity() {
    return new Gravity;
}

exports.LayoutSpec = void 0;
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
})(exports.LayoutSpec || (exports.LayoutSpec = {}));
class LayoutConfigImpl {
    fit() {
        this.widthSpec = exports.LayoutSpec.FIT;
        this.heightSpec = exports.LayoutSpec.FIT;
        return this;
    }
    fitWidth() {
        this.widthSpec = exports.LayoutSpec.FIT;
        return this;
    }
    fitHeight() {
        this.heightSpec = exports.LayoutSpec.FIT;
        return this;
    }
    most() {
        this.widthSpec = exports.LayoutSpec.MOST;
        this.heightSpec = exports.LayoutSpec.MOST;
        return this;
    }
    mostWidth() {
        this.widthSpec = exports.LayoutSpec.MOST;
        return this;
    }
    mostHeight() {
        this.heightSpec = exports.LayoutSpec.MOST;
        return this;
    }
    just() {
        this.widthSpec = exports.LayoutSpec.JUST;
        this.heightSpec = exports.LayoutSpec.JUST;
        return this;
    }
    justWidth() {
        this.widthSpec = exports.LayoutSpec.JUST;
        return this;
    }
    justHeight() {
        this.heightSpec = exports.LayoutSpec.JUST;
        return this;
    }
    configWidth(w) {
        this.widthSpec = w;
        return this;
    }
    configHeight(h) {
        this.heightSpec = h;
        return this;
    }
    configMargin(m) {
        this.margin = m;
        return this;
    }
    configAlignment(a) {
        this.alignment = a;
        return this;
    }
    configWeight(w) {
        this.weight = w;
        return this;
    }
    configMaxWidth(v) {
        this.maxWidth = v;
        return this;
    }
    configMaxHeight(v) {
        this.maxHeight = v;
        return this;
    }
    configMinWidth(v) {
        this.minWidth = v;
        return this;
    }
    configMinHeight(v) {
        this.minHeight = v;
        return this;
    }
    toModel() {
        return {
            widthSpec: this.widthSpec,
            heightSpec: this.heightSpec,
            margin: this.margin,
            alignment: this.alignment ? this.alignment.toModel() : undefined,
            weight: this.weight,
        };
    }
}
function layoutConfig() {
    return new LayoutConfigImpl;
}

var __decorate$e = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$e = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class Stack extends Group {
}
class Root extends Stack {
}
class LinearLayout extends Group {
}
__decorate$e([
    Property,
    __metadata$e("design:type", Number)
], LinearLayout.prototype, "space", void 0);
__decorate$e([
    Property,
    __metadata$e("design:type", Gravity)
], LinearLayout.prototype, "gravity", void 0);
class VLayout extends LinearLayout {
}
class HLayout extends LinearLayout {
}
function stack(views, config) {
    const ret = new Stack;
    ret.layoutConfig = layoutConfig().fit();
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        ret.apply(config);
    }
    return ret;
}
function hlayout(views, config) {
    const ret = new HLayout;
    ret.layoutConfig = layoutConfig().fit();
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        ret.apply(config);
    }
    return ret;
}
function vlayout(views, config) {
    const ret = new VLayout;
    ret.layoutConfig = layoutConfig().fit();
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        ret.apply(config);
    }
    return ret;
}
class FlexLayout extends Group {
}
function flexlayout(views, config) {
    const ret = new FlexLayout;
    ret.layoutConfig = layoutConfig().fit();
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        ret.apply(config);
    }
    return ret;
}

var __decorate$d = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$d = (undefined && undefined.__metadata) || function (k, v) {
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
        this.destroyed = false;
        this.__root__ = new Root;
        this.headviews = new Map;
        this.onRenderFinishedCallback = [];
        this.__rendering__ = false;
        this.snapshotEnabled = false;
        this.renderSnapshots = [];
    }
    onCreate() { }
    onDestroy() { }
    onShow() { }
    onHidden() { }
    onEnvChanged() {
        this.__root__.children.length = 0;
        this.build(this.__root__);
    }
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
    __onEnvChanged__() {
        this.onEnvChanged();
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
    __renderSnapshotDepth__() {
        return this.renderSnapshots.length;
    }
    __restoreRenderSnapshot__(idx) {
        return [...this.renderSnapshots].slice(0, idx);
    }
    __enableSnapshot__() {
        this.snapshotEnabled = true;
    }
    nativeRender(model) {
        if (this.snapshotEnabled) {
            this.renderSnapshots.push(JSON.parse(JSON.stringify(model)));
        }
        return this.context.callNative("shader", "render", model);
    }
    hookBeforeNativeCall() {
    }
    hookAfterNativeCall() {
        if (this.destroyed) {
            return;
        }
        const promises = [];
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
__decorate$d([
    NativeCall,
    __metadata$d("design:type", Function),
    __metadata$d("design:paramtypes", [String]),
    __metadata$d("design:returntype", void 0)
], Panel.prototype, "__init__", null);
__decorate$d([
    NativeCall,
    __metadata$d("design:type", Function),
    __metadata$d("design:paramtypes", []),
    __metadata$d("design:returntype", void 0)
], Panel.prototype, "__onCreate__", null);
__decorate$d([
    NativeCall,
    __metadata$d("design:type", Function),
    __metadata$d("design:paramtypes", []),
    __metadata$d("design:returntype", void 0)
], Panel.prototype, "__onDestroy__", null);
__decorate$d([
    NativeCall,
    __metadata$d("design:type", Function),
    __metadata$d("design:paramtypes", []),
    __metadata$d("design:returntype", void 0)
], Panel.prototype, "__onShow__", null);
__decorate$d([
    NativeCall,
    __metadata$d("design:type", Function),
    __metadata$d("design:paramtypes", []),
    __metadata$d("design:returntype", void 0)
], Panel.prototype, "__onHidden__", null);
__decorate$d([
    NativeCall,
    __metadata$d("design:type", Function),
    __metadata$d("design:paramtypes", [Object]),
    __metadata$d("design:returntype", void 0)
], Panel.prototype, "__build__", null);
__decorate$d([
    NativeCall,
    __metadata$d("design:type", Function),
    __metadata$d("design:paramtypes", []),
    __metadata$d("design:returntype", void 0)
], Panel.prototype, "__onEnvChanged__", null);
__decorate$d([
    NativeCall,
    __metadata$d("design:type", Function),
    __metadata$d("design:paramtypes", [Array, String]),
    __metadata$d("design:returntype", void 0)
], Panel.prototype, "__response__", null);
__decorate$d([
    NativeCall,
    __metadata$d("design:type", Function),
    __metadata$d("design:paramtypes", []),
    __metadata$d("design:returntype", void 0)
], Panel.prototype, "__renderSnapshotDepth__", null);
__decorate$d([
    NativeCall,
    __metadata$d("design:type", Function),
    __metadata$d("design:paramtypes", [Number]),
    __metadata$d("design:returntype", void 0)
], Panel.prototype, "__restoreRenderSnapshot__", null);
__decorate$d([
    NativeCall,
    __metadata$d("design:type", Function),
    __metadata$d("design:paramtypes", []),
    __metadata$d("design:returntype", void 0)
], Panel.prototype, "__enableSnapshot__", null);

/**
 *  Store color as format AARRGGBB or RRGGBB
 */
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
exports.GradientOrientation = void 0;
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
exports.RepeatMode = void 0;
(function (RepeatMode) {
    RepeatMode[RepeatMode["RESTART"] = 1] = "RESTART";
    RepeatMode[RepeatMode["REVERSE"] = 2] = "REVERSE";
})(exports.RepeatMode || (exports.RepeatMode = {}));
exports.FillMode = void 0;
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
})(exports.FillMode || (exports.FillMode = {}));
exports.TimingFunction = void 0;
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
})(exports.TimingFunction || (exports.TimingFunction = {}));
class Animation {
    constructor() {
        this.changeables = new Map;
        this.duration = 0;
        this.fillMode = exports.FillMode.Forward;
        this.id = uniqueId("Animation");
    }
    toModel() {
        const changeables = [];
        for (let e of this.changeables.values()) {
            changeables.push({
                key: e.key,
                fromValue: e.fromValue,
                toValue: e.toValue,
                keyFrames: e.keyFrames,
            });
        }
        return {
            type: this.constructor.name,
            delay: this.delay,
            duration: this.duration,
            changeables,
            repeatCount: this.repeatCount,
            repeatMode: this.repeatMode,
            fillMode: this.fillMode,
            timingFunction: this.timingFunction,
            id: this.id,
        };
    }
}
class ScaleAnimation extends Animation {
    constructor() {
        super();
        this.scaleXChangeable = {
            key: "scaleX",
            fromValue: 1,
            toValue: 1,
        };
        this.scaleYChangeable = {
            key: "scaleY",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("scaleX", this.scaleXChangeable);
        this.changeables.set("scaleY", this.scaleYChangeable);
    }
    set xKeyFrames(keyFrames) {
        this.scaleXChangeable.keyFrames = keyFrames;
    }
    set yKeyFrames(keyFrames) {
        this.scaleYChangeable.keyFrames = keyFrames;
    }
    set fromScaleX(v) {
        this.scaleXChangeable.fromValue = v;
    }
    get fromScaleX() {
        return this.scaleXChangeable.fromValue;
    }
    set toScaleX(v) {
        this.scaleXChangeable.toValue = v;
    }
    get toScaleX() {
        return this.scaleXChangeable.toValue;
    }
    set fromScaleY(v) {
        this.scaleYChangeable.fromValue = v;
    }
    get fromScaleY() {
        return this.scaleYChangeable.fromValue;
    }
    set toScaleY(v) {
        this.scaleYChangeable.toValue = v;
    }
    get toScaleY() {
        return this.scaleYChangeable.toValue;
    }
}
class TranslationAnimation extends Animation {
    constructor() {
        super();
        this.translationXChangeable = {
            key: "translationX",
            fromValue: 0,
            toValue: 0,
        };
        this.translationYChangeable = {
            key: "translationY",
            fromValue: 0,
            toValue: 0,
        };
        this.changeables.set("translationX", this.translationXChangeable);
        this.changeables.set("translationY", this.translationYChangeable);
    }
    set xKeyFrames(keyFrames) {
        this.translationXChangeable.keyFrames = keyFrames;
    }
    set yKeyFrames(keyFrames) {
        this.translationYChangeable.keyFrames = keyFrames;
    }
    set fromTranslationX(v) {
        this.translationXChangeable.fromValue = v;
    }
    get fromTranslationX() {
        return this.translationXChangeable.fromValue;
    }
    set toTranslationX(v) {
        this.translationXChangeable.toValue = v;
    }
    get toTranslationX() {
        return this.translationXChangeable.toValue;
    }
    set fromTranslationY(v) {
        this.translationYChangeable.fromValue = v;
    }
    get fromTranslationY() {
        return this.translationYChangeable.fromValue;
    }
    set toTranslationY(v) {
        this.translationYChangeable.toValue = v;
    }
    get toTranslationY() {
        return this.translationYChangeable.toValue;
    }
}
/**
 * Rotation range is [0..2]
 */
class RotationAnimation extends Animation {
    constructor() {
        super();
        this.rotationChaneable = {
            key: "rotation",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("rotation", this.rotationChaneable);
    }
    set fromRotation(v) {
        this.rotationChaneable.fromValue = v;
    }
    get fromRotation() {
        return this.rotationChaneable.fromValue;
    }
    set toRotation(v) {
        this.rotationChaneable.toValue = v;
    }
    get toRotation() {
        return this.rotationChaneable.toValue;
    }
    set keyFrames(keyFrames) {
        this.rotationChaneable.keyFrames = keyFrames;
    }
}
/**
 * Rotation range is [0..2]
 */
class RotationXAnimation extends Animation {
    constructor() {
        super();
        this.rotationChaneable = {
            key: "rotationX",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("rotationX", this.rotationChaneable);
    }
    set fromRotation(v) {
        this.rotationChaneable.fromValue = v;
    }
    get fromRotation() {
        return this.rotationChaneable.fromValue;
    }
    set toRotation(v) {
        this.rotationChaneable.toValue = v;
    }
    get toRotation() {
        return this.rotationChaneable.toValue;
    }
    set keyFrames(keyFrames) {
        this.rotationChaneable.keyFrames = keyFrames;
    }
}
/**
 * Rotation range is [0..2]
 */
class RotationYAnimation extends Animation {
    constructor() {
        super();
        this.rotationChaneable = {
            key: "rotationY",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("rotationY", this.rotationChaneable);
    }
    set fromRotation(v) {
        this.rotationChaneable.fromValue = v;
    }
    get fromRotation() {
        return this.rotationChaneable.fromValue;
    }
    set toRotation(v) {
        this.rotationChaneable.toValue = v;
    }
    get toRotation() {
        return this.rotationChaneable.toValue;
    }
    set keyFrames(keyFrames) {
        this.rotationChaneable.keyFrames = keyFrames;
    }
}
class BackgroundColorAnimation extends Animation {
    constructor() {
        super();
        this.backgroundColorChangeable = {
            key: "backgroundColor",
            fromValue: Color.TRANSPARENT._value,
            toValue: Color.TRANSPARENT._value,
        };
        this.changeables.set("backgroundColor", this.backgroundColorChangeable);
    }
    set fromColor(color) {
        this.backgroundColorChangeable.fromValue = color._value;
    }
    get fromColor() {
        return new Color(this.backgroundColorChangeable.fromValue);
    }
    set toColor(v) {
        this.backgroundColorChangeable.toValue = v._value;
    }
    get toColor() {
        return new Color(this.backgroundColorChangeable.toValue);
    }
    set keyFrames(keyFrames) {
        this.backgroundColorChangeable.keyFrames = keyFrames.map(e => { return { percent: e.percent, value: e.value.toModel() }; });
    }
}
/**
 * Alpha range is [0..1]
 */
class AlphaAnimation extends Animation {
    constructor() {
        super();
        this.opacityChangeable = {
            key: "alpha",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("alpha", this.opacityChangeable);
    }
    set from(v) {
        this.opacityChangeable.fromValue = v;
    }
    get from() {
        return this.opacityChangeable.fromValue;
    }
    set to(v) {
        this.opacityChangeable.toValue = v;
    }
    get to() {
        return this.opacityChangeable.toValue;
    }
    set keyFrames(keyFrames) {
        this.opacityChangeable.keyFrames = keyFrames;
    }
}
class AnimationSet {
    constructor() {
        this.animations = [];
        this._duration = 0;
        this.id = uniqueId("AnimationSet");
    }
    addAnimation(anim) {
        this.animations.push(anim);
    }
    get duration() {
        return this._duration;
    }
    set duration(v) {
        this._duration = v;
        this.animations.forEach(e => e.duration = v);
    }
    toModel() {
        return {
            animations: this.animations.map(e => {
                return e.toModel();
            }),
            delay: this.delay,
            id: this.id,
        };
    }
}

var __decorate$c = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$c = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.TruncateAt = void 0;
(function (TruncateAt) {
    TruncateAt[TruncateAt["End"] = 0] = "End";
    TruncateAt[TruncateAt["Middle"] = 1] = "Middle";
    TruncateAt[TruncateAt["Start"] = 2] = "Start";
    TruncateAt[TruncateAt["Clip"] = 3] = "Clip";
})(exports.TruncateAt || (exports.TruncateAt = {}));
class Text extends View {
    set innerElement(e) {
        this.text = e;
    }
}
__decorate$c([
    Property,
    __metadata$c("design:type", String)
], Text.prototype, "text", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", Object)
], Text.prototype, "textColor", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", Number)
], Text.prototype, "textSize", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", Number)
], Text.prototype, "maxLines", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", Gravity)
], Text.prototype, "textAlignment", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", String)
], Text.prototype, "fontStyle", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", String)
], Text.prototype, "font", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", Number)
], Text.prototype, "maxWidth", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", Number)
], Text.prototype, "maxHeight", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", Number)
], Text.prototype, "lineSpacing", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", Boolean)
], Text.prototype, "strikethrough", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", Boolean)
], Text.prototype, "underline", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", String)
], Text.prototype, "htmlText", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", Number)
], Text.prototype, "truncateAt", void 0);
function text(config) {
    const ret = new Text;
    ret.layoutConfig = layoutConfig().fit();
    ret.apply(config);
    return ret;
}

class Resource {
    constructor(type, identifier) {
        this.type = type;
        this.identifier = identifier;
    }
    toModel() {
        return {
            type: this.type,
            identifier: this.identifier,
        };
    }
}
class LocalResource extends Resource {
    constructor(path) {
        super("local", path);
    }
}
class RemoteResource extends Resource {
    constructor(url) {
        super("remote", url);
    }
}
class Base64Resource extends Resource {
    constructor(content) {
        super("base64", content);
    }
}
/**
 * This is for android platform
 */
class DrawableResource extends Resource {
    constructor(name) {
        super("drawable", name);
    }
}
class RawResource extends Resource {
    constructor(name) {
        super("raw", name);
    }
}
class AssetResource extends Resource {
    constructor(path) {
        super("assets", path);
    }
}
/**
 * This is for iOS platform
 */
class MainBundleResource extends Resource {
    constructor(fileName) {
        super("mainBundle", fileName);
    }
}
class BundleResource extends Resource {
    constructor(bundleName, fileName) {
        super("bundle", `${bundleName}://${fileName}`);
    }
}

var __decorate$b = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$b = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.ScaleType = void 0;
(function (ScaleType) {
    ScaleType[ScaleType["ScaleToFill"] = 0] = "ScaleToFill";
    ScaleType[ScaleType["ScaleAspectFit"] = 1] = "ScaleAspectFit";
    ScaleType[ScaleType["ScaleAspectFill"] = 2] = "ScaleAspectFill";
})(exports.ScaleType || (exports.ScaleType = {}));
class Image extends View {
    isAnimating(context) {
        return this.nativeChannel(context, "isAnimating")();
    }
    startAnimating(context) {
        return this.nativeChannel(context, "startAnimating")();
    }
    stopAnimating(context) {
        return this.nativeChannel(context, "stopAnimating")();
    }
}
__decorate$b([
    Property,
    __metadata$b("design:type", Resource)
], Image.prototype, "image", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", String)
], Image.prototype, "imageUrl", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", String)
], Image.prototype, "imageFilePath", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", String)
], Image.prototype, "imagePath", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", String)
], Image.prototype, "imageRes", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", String)
], Image.prototype, "imageBase64", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", Number)
], Image.prototype, "scaleType", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", Boolean)
], Image.prototype, "isBlur", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", String)
], Image.prototype, "placeHolderImage", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", String)
], Image.prototype, "placeHolderImageBase64", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", Color
    /**
     * Display while image is failed to load
     * It can be file name in local path
     */
    )
], Image.prototype, "placeHolderColor", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", String)
], Image.prototype, "errorImage", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", String)
], Image.prototype, "errorImageBase64", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", Color)
], Image.prototype, "errorColor", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", Function)
], Image.prototype, "loadCallback", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", Number)
], Image.prototype, "imageScale", void 0);
__decorate$b([
    Property,
    __metadata$b("design:type", Object)
], Image.prototype, "stretchInset", void 0);
function image(config) {
    const ret = new Image;
    ret.layoutConfig = layoutConfig().fit();
    ret.apply(config);
    return ret;
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
var __decorate$a = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$a = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class ListItem extends Stack {
}
__decorate$a([
    Property,
    __metadata$a("design:type", String)
], ListItem.prototype, "identifier", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Array)
], ListItem.prototype, "actions", void 0);
class List extends Superview {
    constructor() {
        super(...arguments);
        this.cachedViews = new Map;
        this.itemCount = 0;
        this.batchCount = 15;
    }
    allSubviews() {
        const ret = [...this.cachedViews.values()];
        if (this.loadMoreView) {
            ret.push(this.loadMoreView);
        }
        return ret;
    }
    scrollToItem(context, index, config) {
        const animated = config === null || config === void 0 ? void 0 : config.animated;
        return this.nativeChannel(context, 'scrollToItem')({ index, animated, });
    }
    /**
     * @param context
     * @returns Returns array of visible view's index.
     */
    findVisibleItems(context) {
        return this.nativeChannel(context, 'findVisibleItems')();
    }
    /**
     * @param context
     * @returns Returns array of completely visible view's index.
     */
    findCompletelyVisibleItems(context) {
        return this.nativeChannel(context, 'findCompletelyVisibleItems')();
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
    renderBunchedItems(start, length) {
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
__decorate$a([
    Property,
    __metadata$a("design:type", Object)
], List.prototype, "itemCount", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Function)
], List.prototype, "renderItem", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Object)
], List.prototype, "batchCount", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Function)
], List.prototype, "onLoadMore", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Boolean)
], List.prototype, "loadMore", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", ListItem)
], List.prototype, "loadMoreView", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Function)
], List.prototype, "onScroll", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Function)
], List.prototype, "onScrollEnd", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Number)
], List.prototype, "scrolledPosition", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Boolean)
], List.prototype, "scrollable", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Boolean)
], List.prototype, "bounces", void 0);
function list(config) {
    const ret = new List;
    ret.apply(config);
    return ret;
}
function listItem(item, config) {
    return (new ListItem).also((it) => {
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
            it.apply(config);
        }
    });
}

var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$9 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class SlideItem extends Stack {
}
__decorate$9([
    Property,
    __metadata$9("design:type", String)
], SlideItem.prototype, "identifier", void 0);
class Slider extends Superview {
    constructor() {
        super(...arguments);
        this.cachedViews = new Map;
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
    renderBunchedItems(start, length) {
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
__decorate$9([
    Property,
    __metadata$9("design:type", Object)
], Slider.prototype, "itemCount", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Function)
], Slider.prototype, "renderPage", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Object)
], Slider.prototype, "batchCount", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Function)
], Slider.prototype, "onPageSlided", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Boolean)
], Slider.prototype, "loop", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Boolean)
], Slider.prototype, "scrollable", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Boolean)
], Slider.prototype, "bounces", void 0);
function slider(config) {
    const ret = new Slider;
    ret.apply(config);
    return ret;
}
function slideItem(item, config) {
    return (new SlideItem).also((it) => {
        it.layoutConfig = layoutConfig().most();
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

var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$8 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function scroller(content, config) {
    return (new Scroller).also(v => {
        v.layoutConfig = layoutConfig().fit();
        if (config) {
            v.apply(config);
        }
        v.content = content;
    });
}
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
    set innerElement(e) {
        this.content = e;
    }
}
__decorate$8([
    Property,
    __metadata$8("design:type", Object)
], Scroller.prototype, "contentOffset", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Function)
], Scroller.prototype, "onScroll", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Function)
], Scroller.prototype, "onScrollEnd", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Boolean)
], Scroller.prototype, "scrollable", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Boolean)
], Scroller.prototype, "bounces", void 0);

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$7 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
    set innerElement(e) {
        if (e instanceof View) {
            this.content = e;
        }
        else {
            this.header = e[0];
            this.content = e[1];
        }
    }
}
__decorate$7([
    Property,
    __metadata$7("design:type", Function)
], Refreshable.prototype, "onRefresh", void 0);
function refreshable(config) {
    const ret = new Refreshable;
    ret.layoutConfig = layoutConfig().fit();
    ret.apply(config);
    return ret;
}
function pullable(v, config) {
    Reflect.set(v, 'startAnimation', config.startAnimation);
    Reflect.set(v, 'stopAnimation', config.stopAnimation);
    Reflect.set(v, 'setPullingDistance', config.setPullingDistance);
    return v;
}

var ValueType;
(function (ValueType) {
    ValueType[ValueType["Undefined"] = 0] = "Undefined";
    ValueType[ValueType["Point"] = 1] = "Point";
    ValueType[ValueType["Percent"] = 2] = "Percent";
    ValueType[ValueType["Auto"] = 3] = "Auto";
})(ValueType || (ValueType = {}));
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
exports.FlexDirection = void 0;
(function (FlexDirection) {
    FlexDirection[FlexDirection["COLUMN"] = 0] = "COLUMN";
    FlexDirection[FlexDirection["COLUMN_REVERSE"] = 1] = "COLUMN_REVERSE";
    FlexDirection[FlexDirection["ROW"] = 2] = "ROW";
    FlexDirection[FlexDirection["ROW_REVERSE"] = 3] = "ROW_REVERSE";
})(exports.FlexDirection || (exports.FlexDirection = {}));
exports.Align = void 0;
(function (Align) {
    Align[Align["AUTO"] = 0] = "AUTO";
    Align[Align["FLEX_START"] = 1] = "FLEX_START";
    Align[Align["CENTER"] = 2] = "CENTER";
    Align[Align["FLEX_END"] = 3] = "FLEX_END";
    Align[Align["STRETCH"] = 4] = "STRETCH";
    Align[Align["BASELINE"] = 5] = "BASELINE";
    Align[Align["SPACE_BETWEEN"] = 6] = "SPACE_BETWEEN";
    Align[Align["SPACE_AROUND"] = 7] = "SPACE_AROUND";
})(exports.Align || (exports.Align = {}));
exports.Justify = void 0;
(function (Justify) {
    Justify[Justify["FLEX_START"] = 0] = "FLEX_START";
    Justify[Justify["CENTER"] = 1] = "CENTER";
    Justify[Justify["FLEX_END"] = 2] = "FLEX_END";
    Justify[Justify["SPACE_BETWEEN"] = 3] = "SPACE_BETWEEN";
    Justify[Justify["SPACE_AROUND"] = 4] = "SPACE_AROUND";
    Justify[Justify["SPACE_EVENLY"] = 5] = "SPACE_EVENLY";
})(exports.Justify || (exports.Justify = {}));
exports.Direction = void 0;
(function (Direction) {
    Direction[Direction["INHERIT"] = 0] = "INHERIT";
    Direction[Direction["LTR"] = 1] = "LTR";
    Direction[Direction["RTL"] = 2] = "RTL";
})(exports.Direction || (exports.Direction = {}));
exports.PositionType = void 0;
(function (PositionType) {
    PositionType[PositionType["RELATIVE"] = 0] = "RELATIVE";
    PositionType[PositionType["ABSOLUTE"] = 1] = "ABSOLUTE";
})(exports.PositionType || (exports.PositionType = {}));
exports.Wrap = void 0;
(function (Wrap) {
    Wrap[Wrap["NO_WRAP"] = 0] = "NO_WRAP";
    Wrap[Wrap["WRAP"] = 1] = "WRAP";
    Wrap[Wrap["WRAP_REVERSE"] = 2] = "WRAP_REVERSE";
})(exports.Wrap || (exports.Wrap = {}));
exports.OverFlow = void 0;
(function (OverFlow) {
    OverFlow[OverFlow["VISIBLE"] = 0] = "VISIBLE";
    OverFlow[OverFlow["HIDDEN"] = 1] = "HIDDEN";
    OverFlow[OverFlow["SCROLL"] = 2] = "SCROLL";
})(exports.OverFlow || (exports.OverFlow = {}));
exports.Display = void 0;
(function (Display) {
    Display[Display["FLEX"] = 0] = "FLEX";
    Display[Display["NONE"] = 1] = "NONE";
})(exports.Display || (exports.Display = {}));

exports.jsx = void 0;
(function (jsx) {
    function createElement(constructor, config, ...children) {
        const e = new constructor();
        if (e instanceof Fragment) {
            return children;
        }
        e.layoutConfig = layoutConfig().fit();
        if (config) {
            e.apply(config);
        }
        if (children && children.length > 0) {
            if (children.length === 1) {
                children = children[0];
            }
            if (Reflect.has(e, "innerElement")) {
                Reflect.set(e, "innerElement", children, e);
            }
            else {
                throw new Error(`Do not support ${constructor.name} for ${children}`);
            }
        }
        return e;
    }
    jsx.createElement = createElement;
    class Fragment extends Group {
    }
    jsx.Fragment = Fragment;
})(exports.jsx || (exports.jsx = {}));

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$6 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class FlowLayoutItem extends Stack {
}
__decorate$6([
    Property,
    __metadata$6("design:type", String)
], FlowLayoutItem.prototype, "identifier", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Boolean)
], FlowLayoutItem.prototype, "fullSpan", void 0);
class FlowLayout extends Superview {
    constructor() {
        super(...arguments);
        this.cachedViews = new Map;
        this.columnCount = 2;
        this.itemCount = 0;
        this.batchCount = 15;
    }
    allSubviews() {
        const ret = [...this.cachedViews.values()];
        if (this.loadMoreView) {
            ret.push(this.loadMoreView);
        }
        return ret;
    }
    /**
     * @param context
     * @returns Returns array of visible view's index.
     */
    findVisibleItems(context) {
        return this.nativeChannel(context, 'findVisibleItems')();
    }
    /**
     * @param context
     * @returns Returns array of completely visible view's index.
     */
    findCompletelyVisibleItems(context) {
        return this.nativeChannel(context, 'findCompletelyVisibleItems')();
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
    renderBunchedItems(start, length) {
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
__decorate$6([
    Property,
    __metadata$6("design:type", Object)
], FlowLayout.prototype, "columnCount", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Number)
], FlowLayout.prototype, "columnSpace", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Number)
], FlowLayout.prototype, "rowSpace", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Object)
], FlowLayout.prototype, "itemCount", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Function)
], FlowLayout.prototype, "renderItem", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Object)
], FlowLayout.prototype, "batchCount", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Function)
], FlowLayout.prototype, "onLoadMore", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Boolean)
], FlowLayout.prototype, "loadMore", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", FlowLayoutItem)
], FlowLayout.prototype, "loadMoreView", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Function)
], FlowLayout.prototype, "onScroll", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Function)
], FlowLayout.prototype, "onScrollEnd", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Boolean)
], FlowLayout.prototype, "scrollable", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Boolean)
], FlowLayout.prototype, "bounces", void 0);
function flowlayout(config) {
    const ret = new FlowLayout;
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}
function flowItem(item, config) {
    return (new FlowLayoutItem).also((it) => {
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
            it.apply(config);
        }
    });
}

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$5 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.ReturnKeyType = void 0;
(function (ReturnKeyType) {
    ReturnKeyType[ReturnKeyType["Default"] = 0] = "Default";
    ReturnKeyType[ReturnKeyType["Done"] = 1] = "Done";
    ReturnKeyType[ReturnKeyType["Search"] = 2] = "Search";
    ReturnKeyType[ReturnKeyType["Next"] = 3] = "Next";
    ReturnKeyType[ReturnKeyType["Go"] = 4] = "Go";
    ReturnKeyType[ReturnKeyType["Send"] = 5] = "Send";
})(exports.ReturnKeyType || (exports.ReturnKeyType = {}));
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
__decorate$5([
    InconsistProperty,
    __metadata$5("design:type", String)
], Input.prototype, "text", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Color)
], Input.prototype, "textColor", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Number)
], Input.prototype, "textSize", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", String)
], Input.prototype, "font", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", String)
], Input.prototype, "hintText", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", String)
], Input.prototype, "hintFont", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Number)
], Input.prototype, "inputType", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Color)
], Input.prototype, "hintTextColor", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Boolean)
], Input.prototype, "multiline", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Gravity)
], Input.prototype, "textAlignment", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Function)
], Input.prototype, "onTextChange", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Function)
], Input.prototype, "onFocusChange", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Number)
], Input.prototype, "maxLength", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Boolean)
], Input.prototype, "password", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Boolean)
], Input.prototype, "editable", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Number)
], Input.prototype, "returnKeyType", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Function)
], Input.prototype, "onSubmitEditing", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Boolean)
], Input.prototype, "enableHorizontalScrollBar", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Boolean)
], Input.prototype, "enableVerticalScrollBar", void 0);
__decorate$5([
    Property,
    __metadata$5("design:type", Function)
], Input.prototype, "beforeTextChange", void 0);
exports.InputType = void 0;
(function (InputType) {
    InputType[InputType["Default"] = 0] = "Default";
    InputType[InputType["Number"] = 1] = "Number";
    InputType[InputType["Decimal"] = 2] = "Decimal";
    InputType[InputType["Alphabet"] = 3] = "Alphabet";
    InputType[InputType["Phone"] = 4] = "Phone";
})(exports.InputType || (exports.InputType = {}));
function input(config) {
    const ret = new Input;
    ret.layoutConfig = layoutConfig().just();
    ret.apply(config);
    return ret;
}

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$4 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
__decorate$4([
    Property,
    __metadata$4("design:type", Function)
], NestedSlider.prototype, "onPageSlided", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Boolean)
], NestedSlider.prototype, "scrollable", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Boolean)
], NestedSlider.prototype, "bounces", void 0);

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$3 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * @deprecated The class should not be used, please use GestureContainer class instead
 */
class Draggable extends Stack {
}
__decorate$3([
    Property,
    __metadata$3("design:type", Function)
], Draggable.prototype, "onDrag", void 0);
/**
 * @deprecated The function should not be used, please use gestureContainer function instead
 */
function draggable(views, config) {
    const ret = new Draggable;
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

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$2 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class Switch extends View {
}
__decorate$2([
    InconsistProperty,
    __metadata$2("design:type", Boolean)
], Switch.prototype, "state", void 0);
__decorate$2([
    Property,
    __metadata$2("design:type", Function)
], Switch.prototype, "onSwitch", void 0);
__decorate$2([
    Property,
    __metadata$2("design:type", Color)
], Switch.prototype, "offTintColor", void 0);
__decorate$2([
    Property,
    __metadata$2("design:type", Color)
], Switch.prototype, "onTintColor", void 0);
__decorate$2([
    Property,
    __metadata$2("design:type", Color)
], Switch.prototype, "thumbTintColor", void 0);
function switchView(config) {
    const ret = new Switch;
    ret.layoutConfig = layoutConfig().just();
    ret.width = 50;
    ret.height = 30;
    ret.apply(config);
    return ret;
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
exports.SwipeOrientation = void 0;
(function (SwipeOrientation) {
    SwipeOrientation[SwipeOrientation["LEFT"] = 0] = "LEFT";
    SwipeOrientation[SwipeOrientation["RIGHT"] = 1] = "RIGHT";
    SwipeOrientation[SwipeOrientation["TOP"] = 2] = "TOP";
    SwipeOrientation[SwipeOrientation["BOTTOM"] = 3] = "BOTTOM";
})(exports.SwipeOrientation || (exports.SwipeOrientation = {}));
class GestureContainer extends Stack {
}
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], GestureContainer.prototype, "onSingleTap", void 0);
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], GestureContainer.prototype, "onDoubleTap", void 0);
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], GestureContainer.prototype, "onLongPress", void 0);
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], GestureContainer.prototype, "onPinch", void 0);
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], GestureContainer.prototype, "onPan", void 0);
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], GestureContainer.prototype, "onRotate", void 0);
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], GestureContainer.prototype, "onSwipe", void 0);
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], GestureContainer.prototype, "onTouchDown", void 0);
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], GestureContainer.prototype, "onTouchMove", void 0);
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], GestureContainer.prototype, "onTouchUp", void 0);
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], GestureContainer.prototype, "onTouchCancel", void 0);
function gestureContainer(views, config) {
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

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class BlurEffect extends Stack {
}
__decorate([
    Property,
    __metadata("design:type", Object)
], BlurEffect.prototype, "effectiveRect", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], BlurEffect.prototype, "radius", void 0);
class AeroEffect extends Stack {
}
__decorate([
    Property,
    __metadata("design:type", Object)
], AeroEffect.prototype, "effectiveRect", void 0);
__decorate([
    Property,
    __metadata("design:type", String)
], AeroEffect.prototype, "style", void 0);
function blurEffect(views, config) {
    const ret = new BlurEffect;
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
function aeroEffect(views, config) {
    const ret = new AeroEffect;
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

function modal(context) {
    return {
        toast: (msg, gravity = Gravity.Bottom) => {
            context.callNative('modal', 'toast', {
                msg,
                gravity: gravity.toModel(),
            });
        },
        alert: (arg) => {
            if (typeof arg === 'string') {
                return context.callNative('modal', 'alert', { msg: arg });
            }
            else {
                return context.callNative('modal', 'alert', arg);
            }
        },
        confirm: (arg) => {
            if (typeof arg === 'string') {
                return context.callNative('modal', 'confirm', { msg: arg });
            }
            else {
                return context.callNative('modal', 'confirm', arg);
            }
        },
        prompt: (arg) => {
            return context.callNative('modal', 'prompt', arg);
        },
    };
}

function navbar(context) {
    const entity = context.entity;
    let panel = undefined;
    if (entity instanceof Panel) {
        panel = entity;
    }
    return {
        isHidden: () => {
            return context.callNative('navbar', 'isHidden');
        },
        setHidden: (hidden) => {
            return context.callNative('navbar', 'setHidden', { hidden, });
        },
        setTitle: (title) => {
            return context.callNative('navbar', 'setTitle', { title, });
        },
        setBgColor: (color) => {
            return context.callNative('navbar', 'setBgColor', { color: color.toModel(), });
        },
        setLeft: (view) => {
            if (panel) {
                panel.clearHeadViews("navbar_left");
                panel.addHeadView("navbar_left", view);
            }
            return context.callNative('navbar', 'setLeft', view.toModel());
        },
        setRight: (view) => {
            if (panel) {
                panel.clearHeadViews("navbar_right");
                panel.addHeadView("navbar_right", view);
            }
            return context.callNative('navbar', 'setRight', view.toModel());
        },
        setCenter: (view) => {
            if (panel) {
                panel.clearHeadViews("navbar_center");
                panel.addHeadView("navbar_center", view);
            }
            return context.callNative('navbar', 'setCenter', view.toModel());
        },
    };
}

function internalScheme(context, panelClass) {
    return `_internal_://export?class=${encodeURIComponent(panelClass.name)}&context=${context.id}`;
}
function navigator(context) {
    const moduleName = "navigator";
    return {
        push: (source, config) => {
            if (typeof source === 'function') {
                source = internalScheme(context, source);
            }
            if (config && config.extra) {
                config.extra = JSON.stringify(config.extra);
            }
            return context.callNative(moduleName, 'push', {
                source, config
            });
        },
        pop: (animated = true) => {
            return context.callNative(moduleName, 'pop', { animated });
        },
        popSelf: (animated = true) => {
            return context.callNative(moduleName, 'popSelf', { animated });
        },
        popToRoot: (animated = true) => {
            return context.callNative(moduleName, 'popToRoot', { animated });
        },
        openUrl: (url) => {
            return context.callNative(moduleName, "openUrl", url);
        },
    };
}

function transformRequest(request) {
    let url = request.url || "";
    if (request.params !== undefined) {
        const queryStrings = [];
        for (let key in request.params) {
            queryStrings.push(`${key}=${encodeURIComponent(request.params[key])}`);
        }
        request.url = `${request.url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStrings.join('&')}`;
    }
    if (typeof request.data === 'object') {
        request.data = JSON.stringify(request.data);
    }
    return request;
}
function network(context) {
    return {
        request: (config) => {
            return context.callNative('network', 'request', transformRequest(config));
        },
        get: (url, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "get";
            return context.callNative('network', 'request', transformRequest(finalConfig));
        },
        post: (url, data, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "post";
            if (data !== undefined) {
                finalConfig.data = data;
            }
            return context.callNative('network', 'request', transformRequest(finalConfig));
        },
        put: (url, data, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "put";
            if (data !== undefined) {
                finalConfig.data = data;
            }
            return context.callNative('network', 'request', transformRequest(finalConfig));
        },
        delete: (url, data, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "delete";
            return context.callNative('network', 'request', transformRequest(finalConfig));
        },
    };
}

function storage(context) {
    return {
        setItem: (key, value, zone) => {
            return context.callNative('storage', 'setItem', { key, value, zone });
        },
        getItem: (key, zone) => {
            return context.callNative('storage', 'getItem', { key, zone });
        },
        remove: (key, zone) => {
            return context.callNative('storage', 'remove', { key, zone });
        },
        clear: (zone) => {
            return context.callNative('storage', 'clear', { zone });
        },
    };
}

function popover(context) {
    const entity = context.entity;
    let panel = undefined;
    if (entity instanceof Panel) {
        panel = entity;
    }
    return {
        show: (view) => {
            if (panel) {
                panel.addHeadView("popover", view);
            }
            return context.callNative('popover', 'show', view.toModel());
        },
        dismiss: (view = undefined) => {
            if (panel) {
                if (view) {
                    panel.removeHeadView("popover", view);
                }
                else {
                    panel.clearHeadViews("popover");
                }
            }
            return context.callNative('popover', 'dismiss', view ? { id: view.viewId } : undefined);
        },
    };
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
function take(target) {
    return (block) => {
        block(target);
    };
}
function takeNonNull(target) {
    return (block) => {
        if (target !== undefined) {
            return block(target);
        }
    };
}
function takeNull(target) {
    return (block) => {
        if (target === undefined) {
            return block();
        }
    };
}
function takeLet(target) {
    return (block) => {
        return block(target);
    };
}
function takeAlso(target) {
    return (block) => {
        block(target);
        return target;
    };
}
function takeIf(target) {
    return (predicate) => {
        return predicate(target) ? target : undefined;
    };
}
function takeUnless(target) {
    return (predicate) => {
        return predicate(target) ? undefined : target;
    };
}
function repeat(action) {
    return (times) => {
        for (let i = 0; i < times; i++) {
            action(i);
        }
    };
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Only supports x,y,width,height,corner(just for four corners),rotation,bgColor,
 * @param panel @see Panel
 */
function animate(context) {
    const entity = context.entity;
    if (entity instanceof Panel) {
        let panel = entity;
        return (args) => __awaiter(this, void 0, void 0, function* () {
            yield context.callNative('animate', 'submit');
            args.animations();
            return takeLet(panel.getRootView())(root => {
                if (root.isDirty()) {
                    const model = root.toModel();
                    model.duration = args.duration;
                    const ret = context.callNative('animate', 'animateRender', model);
                    root.clean();
                    return ret;
                }
                for (let map of panel.allHeadViews()) {
                    for (let v of map.values()) {
                        if (v.isDirty()) {
                            const model_1 = v.toModel();
                            model_1.duration = args.duration;
                            const ret_1 = context.callNative('animate', 'animateRender', model_1);
                            v.clean();
                            return ret_1;
                        }
                    }
                }
                throw new Error('Cannot find any animated elements');
            });
        });
    }
    else {
        return (args) => {
            return Promise.reject(`Cannot find panel in Context:${context.id}`);
        };
    }
}

function notification(context) {
    return {
        publish: (args) => {
            if (args.data !== undefined) {
                args.data = JSON.stringify(args.data);
            }
            return context.callNative('notification', 'publish', args);
        },
        subscribe: (args) => {
            args.callback = context.function2Id(args.callback);
            return context.callNative('notification', 'subscribe', args);
        },
        unsubscribe: (subscribeId) => {
            context.removeFuncById(subscribeId);
            return context.callNative('notification', 'unsubscribe', subscribeId);
        }
    };
}

exports.StatusBarMode = void 0;
(function (StatusBarMode) {
    StatusBarMode[StatusBarMode["LIGHT"] = 0] = "LIGHT";
    StatusBarMode[StatusBarMode["DARK"] = 1] = "DARK";
})(exports.StatusBarMode || (exports.StatusBarMode = {}));
function statusbar(context) {
    return {
        setHidden: (hidden) => {
            return context.callNative('statusbar', 'setHidden', { hidden });
        },
        setMode: (mode) => {
            return context.callNative('statusbar', 'setMode', { mode });
        },
        setColor: (color) => {
            return context.callNative('statusbar', 'setColor', { color: color.toModel() });
        },
    };
}

function viewIdChains(view) {
    const viewIds = [];
    let thisView = view;
    while (thisView != undefined) {
        viewIds.push(thisView.viewId);
        thisView = thisView.superview;
    }
    return viewIds.reverse();
}
function coordinator(context) {
    return {
        verticalScrolling: (argument) => {
            if (context.entity instanceof Panel) {
                const panel = context.entity;
                panel.addOnRenderFinishedCallback(() => {
                    argument.scrollable = viewIdChains(argument.scrollable);
                    if (argument.target instanceof View) {
                        argument.target = viewIdChains(argument.target);
                    }
                    if (argument.changing.start instanceof Color) {
                        argument.changing.start = argument.changing.start.toModel();
                    }
                    if (argument.changing.end instanceof Color) {
                        argument.changing.end = argument.changing.end.toModel();
                    }
                    context.callNative("coordinator", "verticalScrolling", argument);
                });
            }
        }
    };
}

function notch(context) {
    return {
        inset: () => {
            return context.callNative('notch', 'inset', {});
        }
    };
}

function keyboard(context) {
    return {
        subscribe: (callback) => {
            return context.callNative('keyboard', 'subscribe', context.function2Id(callback));
        },
        unsubscribe: (subscribeId) => {
            context.removeFuncById(subscribeId);
            return context.callNative('keyboard', 'unsubscribe', subscribeId);
        }
    };
}

class Observable {
    constructor(provider, clz) {
        this.observers = new Set;
        this.provider = provider;
        this.clz = clz;
    }
    addObserver(observer) {
        this.observers.add(observer);
    }
    removeObserver(observer) {
        this.observers.delete(observer);
    }
    update(updater) {
        const oldV = this.provider.acquire(this.clz);
        const newV = updater(oldV);
        if (newV !== undefined) {
            this.provider.provide(newV);
        }
        for (let observer of this.observers) {
            observer(newV);
        }
    }
}
class Provider {
    constructor() {
        this.provision = new Map;
        this.observableMap = new Map;
    }
    provide(obj) {
        this.provision.set(obj.constructor, obj);
    }
    acquire(clz) {
        const ret = this.provision.get(clz);
        return ret;
    }
    remove(clz) {
        this.provision.delete(clz);
    }
    clear() {
        this.provision.clear();
    }
    observe(clz) {
        let observable = this.observableMap.get(clz);
        if (observable === undefined) {
            observable = new Observable(this, clz);
            this.observableMap.set(clz, observable);
        }
        return observable;
    }
}

class ViewHolder {
}
class ViewModel {
    constructor(obj, v) {
        this.state = obj;
        this.viewHolder = v;
    }
    getState() {
        return this.state;
    }
    getViewHolder() {
        return this.viewHolder;
    }
    updateState(setter) {
        setter(this.state);
        this.onBind(this.state, this.viewHolder);
    }
    attach(view) {
        this.viewHolder.build(view);
        this.onAttached(this.state, this.viewHolder);
        this.onBind(this.state, this.viewHolder);
    }
}
class VMPanel extends Panel {
    getViewModel() {
        return this.vm;
    }
    build(root) {
        this.vh = new (this.getViewHolderClass());
        this.vm = new (this.getViewModelClass())(this.getState(), this.vh);
        this.vm.context = this.context;
        this.vm.attach(root);
    }
}

class Module extends Panel {
    constructor() {
        super(...arguments);
        this.unmounted = false;
    }
    get provider() {
        var _a;
        return this.__provider || ((_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.provider);
    }
    set provider(provider) {
        this.__provider = provider;
    }
    mount() {
        var _a;
        if (this.unmounted) {
            this.unmounted = false;
            (_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.onStructureChanged(this, true);
            this.onMounted();
        }
    }
    unmount() {
        var _a;
        if (!this.unmounted) {
            this.unmounted = true;
            (_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.onStructureChanged(this, false);
            this.onUnmounted();
        }
    }
    get mounted() {
        return !this.unmounted;
    }
    /**
     * Dispatch message to other modules.
     * @param message which is sent out
     */
    dispatchMessage(message) {
        var _a;
        (_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.dispatchMessage(message);
    }
    /**
     * Dispatched messages can be received by override this method.
     * @param message recevied message
     */
    onMessage(message) { }
    /**
     * Called when this module is mounted
     */
    onMounted() { }
    /**
     * Called when this module is unmounted
     */
    onUnmounted() { }
}
class VMModule extends Module {
    getViewModel() {
        return this.vm;
    }
    build(root) {
        this.vh = new (this.getViewHolderClass());
        this.vm = new (this.getViewModelClass())(this.getState(), this.vh);
        this.vm.context = this.context;
        this.vm.attach(root);
    }
}
class ModularPanel extends Module {
    constructor() {
        super();
        this.modules = this.setupModules().map(e => {
            const instance = new e;
            if (instance instanceof Module) {
                instance.superPanel = this;
            }
            return instance;
        });
    }
    dispatchMessage(message) {
        if (this.superPanel) {
            this.superPanel.dispatchMessage(message);
        }
        else {
            this.onMessage(message);
        }
    }
    get mountedModules() {
        return this.modules.filter(e => !(e instanceof Module) || e.mounted);
    }
    onMessage(message) {
        this.mountedModules.forEach(e => {
            if (e instanceof Module) {
                e.onMessage(message);
            }
        });
    }
    onStructureChanged(module, mounted) {
        if (this.superPanel) {
            this.superPanel.onStructureChanged(module, mounted);
        }
        else {
            if (!!!this.scheduledRebuild) {
                this.scheduledRebuild = setTimeout(() => {
                    this.scheduledRebuild = undefined;
                    this.getRootView().children.length = 0;
                    this.build(this.getRootView());
                }, 0);
            }
        }
    }
    build(root) {
        const groupView = this.setupShelf(root);
        this.mountedModules.forEach(e => {
            Reflect.set(e, "__root__", groupView);
            e.build(groupView);
        });
    }
    onCreate() {
        super.onCreate();
        this.mountedModules.forEach(e => {
            e.context = this.context;
            e.onCreate();
        });
    }
    onDestroy() {
        super.onDestroy();
        this.mountedModules.forEach(e => {
            e.onDestroy();
        });
    }
    onShow() {
        super.onShow();
        this.mountedModules.forEach(e => {
            e.onShow();
        });
    }
    onHidden() {
        super.onHidden();
        this.mountedModules.forEach(e => {
            e.onHidden();
        });
    }
    onRenderFinished() {
        super.onRenderFinished();
        this.mountedModules.forEach(e => {
            e.onRenderFinished();
        });
    }
}

exports.AeroEffect = AeroEffect;
exports.AlphaAnimation = AlphaAnimation;
exports.AnimationSet = AnimationSet;
exports.AssetResource = AssetResource;
exports.BOTTOM = BOTTOM;
exports.BackgroundColorAnimation = BackgroundColorAnimation;
exports.Base64Resource = Base64Resource;
exports.BlurEffect = BlurEffect;
exports.BundleResource = BundleResource;
exports.CENTER = CENTER;
exports.CENTER_X = CENTER_X;
exports.CENTER_Y = CENTER_Y;
exports.Color = Color;
exports.Draggable = Draggable;
exports.DrawableResource = DrawableResource;
exports.FlexLayout = FlexLayout;
exports.FlexTypedValue = FlexTypedValue;
exports.FlowLayout = FlowLayout;
exports.FlowLayoutItem = FlowLayoutItem;
exports.GestureContainer = GestureContainer;
exports.Gravity = Gravity;
exports.Group = Group;
exports.HLayout = HLayout;
exports.Image = Image;
exports.InconsistProperty = InconsistProperty;
exports.Input = Input;
exports.LEFT = LEFT;
exports.LayoutConfigImpl = LayoutConfigImpl;
exports.List = List;
exports.ListItem = ListItem;
exports.LocalResource = LocalResource;
exports.MainBundleResource = MainBundleResource;
exports.ModularPanel = ModularPanel;
exports.Module = Module;
exports.Mutable = Mutable;
exports.NativeCall = NativeCall;
exports.NestedSlider = NestedSlider;
exports.Observable = Observable;
exports.Panel = Panel;
exports.Property = Property;
exports.Provider = Provider;
exports.RIGHT = RIGHT;
exports.RawResource = RawResource;
exports.Ref = Ref;
exports.Refreshable = Refreshable;
exports.RemoteResource = RemoteResource;
exports.Resource = Resource;
exports.Root = Root;
exports.RotationAnimation = RotationAnimation;
exports.RotationXAnimation = RotationXAnimation;
exports.RotationYAnimation = RotationYAnimation;
exports.ScaleAnimation = ScaleAnimation;
exports.Scroller = Scroller;
exports.SlideItem = SlideItem;
exports.Slider = Slider;
exports.Stack = Stack;
exports.Superview = Superview;
exports.Switch = Switch;
exports.TOP = TOP;
exports.Text = Text;
exports.TranslationAnimation = TranslationAnimation;
exports.VLayout = VLayout;
exports.VMModule = VMModule;
exports.VMPanel = VMPanel;
exports.View = View;
exports.ViewComponent = ViewComponent;
exports.ViewHolder = ViewHolder;
exports.ViewModel = ViewModel;
exports.aeroEffect = aeroEffect;
exports.animate = animate;
exports.blurEffect = blurEffect;
exports.coordinator = coordinator;
exports.createRef = createRef;
exports.draggable = draggable;
exports.flexlayout = flexlayout;
exports.flowItem = flowItem;
exports.flowlayout = flowlayout;
exports.gestureContainer = gestureContainer;
exports.gravity = gravity;
exports.hlayout = hlayout;
exports.image = image;
exports.input = input;
exports.internalScheme = internalScheme;
exports.keyboard = keyboard;
exports.layoutConfig = layoutConfig;
exports.list = list;
exports.listItem = listItem;
exports.log = log;
exports.loge = loge;
exports.logw = logw;
exports.modal = modal;
exports.navbar = navbar;
exports.navigator = navigator;
exports.network = network;
exports.notch = notch;
exports.notification = notification;
exports.obj2Model = obj2Model;
exports.popover = popover;
exports.pullable = pullable;
exports.refreshable = refreshable;
exports.repeat = repeat;
exports.scroller = scroller;
exports.slideItem = slideItem;
exports.slider = slider;
exports.stack = stack;
exports.statusbar = statusbar;
exports.storage = storage;
exports.switchView = switchView;
exports.take = take;
exports.takeAlso = takeAlso;
exports.takeIf = takeIf;
exports.takeLet = takeLet;
exports.takeNonNull = takeNonNull;
exports.takeNull = takeNull;
exports.takeUnless = takeUnless;
exports.text = text;
exports.uniqueId = uniqueId;
exports.vlayout = vlayout;
