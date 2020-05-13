'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var reflectMetadata = require('reflect-metadata');

function obj2Model(obj) {
    if (obj instanceof Array) {
        return obj.map(function (e) { return obj2Model(e); });
    }
    else if (obj instanceof Object) {
        if (Reflect.has(obj, 'toModel') && Reflect.get(obj, 'toModel') instanceof Function) {
            obj = Reflect.apply(Reflect.get(obj, 'toModel'), obj, []);
            return obj;
        }
        else {
            for (var key in obj) {
                var val = Reflect.get(obj, key);
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
var __uniqueId__ = 0;
function uniqueId(prefix) {
    return "__" + prefix + "_" + __uniqueId__++ + "__";
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
function loge() {
    var arguments$1 = arguments;

    var message = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        message[_i] = arguments$1[_i];
    }
    var out = "";
    for (var i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ',';
        }
        out += toString(arguments$1[i]);
    }
    nativeLog('e', out);
}

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) { return m.call(o); }
    if (o && typeof o.length === "number") { return {
        next: function () {
            if (o && i >= o.length) { o = void 0; }
            return { value: o && o[i++], done: !o };
        }
    }; }
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
function Property(target, propKey) {
    Object.defineProperty(target, propKey, {
        get: function () {
            return Reflect.get(this, "__prop__" + propKey, this);
        },
        set: function (v) {
            var oldV = Reflect.get(this, "__prop__" + propKey, this);
            Reflect.set(this, "__prop__" + propKey, v, this);
            if (oldV !== v) {
                Reflect.apply(this.onPropertyChanged, this, [propKey, oldV, v]);
            }
        },
    });
}
var View = /** @class */ (function () {
    function View() {
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.viewId = uniqueId('ViewId');
        this.nativeViewModel = {
            id: this.viewId,
            type: this.constructor.name,
            props: this.__dirty_props__,
        };
    }
    View.prototype.callback2Id = function (f) {
        if (this.callbacks === undefined) {
            this.callbacks = new Map;
        }
        var id = uniqueId('Function');
        this.callbacks.set(id, f);
        return id;
    };
    View.prototype.id2Callback = function (id) {
        if (this.callbacks === undefined) {
            this.callbacks = new Map;
        }
        var f = this.callbacks.get(id);
        if (f === undefined) {
            f = Reflect.get(this, id);
        }
        return f;
    };
    Object.defineProperty(View.prototype, "left", {
        /** Anchor start*/
        get: function () {
            return this.x;
        },
        set: function (v) {
            this.x = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "right", {
        get: function () {
            return this.x + this.width;
        },
        set: function (v) {
            this.x = v - this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "top", {
        get: function () {
            return this.y;
        },
        set: function (v) {
            this.y = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "bottom", {
        get: function () {
            return this.y + this.height;
        },
        set: function (v) {
            this.y = v - this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "centerX", {
        get: function () {
            return this.x + this.width / 2;
        },
        set: function (v) {
            this.x = v - this.width / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "centerY", {
        get: function () {
            return this.y + this.height / 2;
        },
        set: function (v) {
            this.y = v - this.height / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "dirtyProps", {
        /** Anchor end*/
        get: function () {
            return this.__dirty_props__;
        },
        enumerable: false,
        configurable: true
    });
    View.prototype.onPropertyChanged = function (propKey, oldV, newV) {
        if (newV instanceof Function) {
            newV = this.callback2Id(newV);
        }
        else {
            newV = obj2Model(newV);
        }
        if (this.__dirty_props__ === undefined) {
            this.__dirty_props__ = {};
        }
        this.__dirty_props__[propKey] = newV;
    };
    View.prototype.clean = function () {
        for (var key in this.__dirty_props__) {
            if (Reflect.has(this.__dirty_props__, key)) {
                Reflect.deleteProperty(this.__dirty_props__, key);
            }
        }
    };
    View.prototype.isDirty = function () {
        return Reflect.ownKeys(this.__dirty_props__).length !== 0;
    };
    View.prototype.responseCallback = function (id) {
        var arguments$1 = arguments;

        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments$1[_i];
        }
        var f = this.id2Callback(id);
        if (f instanceof Function) {
            var argumentsList = [];
            for (var i = 1; i < arguments.length; i++) {
                argumentsList.push(arguments$1[i]);
            }
            return Reflect.apply(f, this, argumentsList);
        }
        else {
            loge("Cannot find callback:" + id + " for " + JSON.stringify(this.toModel()));
        }
    };
    View.prototype.toModel = function () {
        return this.nativeViewModel;
    };
    View.prototype.let = function (block) {
        block(this);
    };
    View.prototype.also = function (block) {
        block(this);
        return this;
    };
    View.prototype.apply = function (config) {
        for (var key in config) {
            Reflect.set(this, key, Reflect.get(config, key, config), this);
        }
        return this;
    };
    View.prototype.in = function (group) {
        group.addChild(this);
        return this;
    };
    View.prototype.nativeChannel = function (context, name) {
        var thisView = this;
        return function (args) {
            if (args === void 0) { args = undefined; }
            var viewIds = [];
            while (thisView != undefined) {
                viewIds.push(thisView.viewId);
                thisView = thisView.superview;
            }
            var params = {
                viewIds: viewIds.reverse(),
                name: name,
                args: args,
            };
            return context.callNative('shader', 'command', params);
        };
    };
    View.prototype.getWidth = function (context) {
        return this.nativeChannel(context, 'getWidth')();
    };
    View.prototype.getHeight = function (context) {
        return this.nativeChannel(context, 'getHeight')();
    };
    View.prototype.getX = function (context) {
        return this.nativeChannel(context, 'getX')();
    };
    View.prototype.getY = function (context) {
        return this.nativeChannel(context, 'getY')();
    };
    View.prototype.getLocationOnScreen = function (context) {
        return this.nativeChannel(context, "getLocationOnScreen")();
    };
    View.prototype.doAnimation = function (context, animation) {
        var _this = this;
        return this.nativeChannel(context, "doAnimation")(animation.toModel()).then(function (args) {
            for (var key in args) {
                Reflect.set(_this, key, Reflect.get(args, key, args), _this);
                Reflect.deleteProperty(_this.__dirty_props__, key);
            }
        });
    };
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
}());
var Superview = /** @class */ (function (_super) {
    __extends(Superview, _super);
    function Superview() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Superview.prototype.subviewById = function (id) {
        var e_1, _a;
        try {
            for (var _b = __values(this.allSubviews()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                if (v.viewId === id) {
                    return v;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) { _a.call(_b); }
            }
            finally { if (e_1) { throw e_1.error; } }
        }
    };
    Superview.prototype.isDirty = function () {
        var e_2, _a;
        if (_super.prototype.isDirty.call(this)) {
            return true;
        }
        else {
            try {
                for (var _b = __values(this.allSubviews()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var v = _c.value;
                    if (v.isDirty()) {
                        return true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) { _a.call(_b); }
                }
                finally { if (e_2) { throw e_2.error; } }
            }
        }
        return false;
    };
    Superview.prototype.clean = function () {
        var e_3, _a;
        try {
            for (var _b = __values(this.allSubviews()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                v.clean();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) { _a.call(_b); }
            }
            finally { if (e_3) { throw e_3.error; } }
        }
        _super.prototype.clean.call(this);
    };
    Superview.prototype.toModel = function () {
        var e_4, _a;
        var subviews = [];
        try {
            for (var _b = __values(this.allSubviews()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                if (v != undefined) {
                    v.superview = this;
                    if (v.isDirty()) {
                        subviews.push(v.toModel());
                    }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) { _a.call(_b); }
            }
            finally { if (e_4) { throw e_4.error; } }
        }
        this.dirtyProps.subviews = subviews;
        return _super.prototype.toModel.call(this);
    };
    return Superview;
}(View));
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = [];
        return _this;
    }
    Group.prototype.allSubviews = function () {
        return this.children;
    };
    Group.prototype.addChild = function (view) {
        this.children.push(view);
        this.dirtyProps.children = this.children.map(function (e) { return e.viewId; });
    };
    return Group;
}(Superview));

var SPECIFIED = 1;
var START = 1 << 1;
var END = 1 << 2;
var SHIFT_X = 0;
var SHIFT_Y = 4;
var LEFT = (START | SPECIFIED) << SHIFT_X;
var RIGHT = (END | SPECIFIED) << SHIFT_X;
var TOP = (START | SPECIFIED) << SHIFT_Y;
var BOTTOM = (END | SPECIFIED) << SHIFT_Y;
var CENTER_X = SPECIFIED << SHIFT_X;
var CENTER_Y = SPECIFIED << SHIFT_Y;
var CENTER = CENTER_X | CENTER_Y;
var Gravity = /** @class */ (function () {
    function Gravity() {
        this.val = 0;
    }
    Gravity.prototype.left = function () {
        var val = this.val | LEFT;
        var ret = new Gravity;
        ret.val = val;
        return ret;
    };
    Gravity.prototype.right = function () {
        var val = this.val | RIGHT;
        var ret = new Gravity;
        ret.val = val;
        return ret;
    };
    Gravity.prototype.top = function () {
        var val = this.val | TOP;
        var ret = new Gravity;
        ret.val = val;
        return ret;
    };
    Gravity.prototype.bottom = function () {
        var val = this.val | BOTTOM;
        var ret = new Gravity;
        ret.val = val;
        return ret;
    };
    Gravity.prototype.center = function () {
        var val = this.val | CENTER;
        var ret = new Gravity;
        ret.val = val;
        return ret;
    };
    Gravity.prototype.centerX = function () {
        var val = this.val | CENTER_X;
        var ret = new Gravity;
        ret.val = val;
        return ret;
    };
    Gravity.prototype.centerY = function () {
        var val = this.val | CENTER_Y;
        var ret = new Gravity;
        ret.val = val;
        return ret;
    };
    Gravity.prototype.toModel = function () {
        return this.val;
    };
    Gravity.origin = new Gravity;
    Gravity.Center = Gravity.origin.center();
    Gravity.CenterX = Gravity.origin.centerX();
    Gravity.CenterY = Gravity.origin.centerY();
    Gravity.Left = Gravity.origin.left();
    Gravity.Right = Gravity.origin.right();
    Gravity.Top = Gravity.origin.top();
    Gravity.Bottom = Gravity.origin.bottom();
    return Gravity;
}());

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

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$1 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var __values$1 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) { return m.call(o); }
    if (o && typeof o.length === "number") { return {
        next: function () {
            if (o && i >= o.length) { o = void 0; }
            return { value: o && o[i++], done: !o };
        }
    }; }
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var Stack = /** @class */ (function (_super) {
    __extends$1(Stack, _super);
    function Stack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Stack;
}(Group));
var Root = /** @class */ (function (_super) {
    __extends$1(Root, _super);
    function Root() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Root;
}(Stack));
var LinearLayout = /** @class */ (function (_super) {
    __extends$1(LinearLayout, _super);
    function LinearLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
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
}(Group));
var VLayout = /** @class */ (function (_super) {
    __extends$1(VLayout, _super);
    function VLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VLayout;
}(LinearLayout));
var HLayout = /** @class */ (function (_super) {
    __extends$1(HLayout, _super);
    function HLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HLayout;
}(LinearLayout));
var FlexLayout = /** @class */ (function (_super) {
    __extends$1(FlexLayout, _super);
    function FlexLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FlexLayout;
}(Group));

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$2 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var __values$2 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) { return m.call(o); }
    if (o && typeof o.length === "number") { return {
        next: function () {
            if (o && i >= o.length) { o = void 0; }
            return { value: o && o[i++], done: !o };
        }
    }; }
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
function NativeCall(target, propertyKey, descriptor) {
    var originVal = descriptor.value;
    descriptor.value = function () {
        var ret = Reflect.apply(originVal, this, arguments);
        return ret;
    };
    return descriptor;
}
var Panel = /** @class */ (function () {
    function Panel() {
        this.destroyed = false;
        this.__root__ = new Root;
        this.headviews = new Map;
        this.onRenderFinishedCallback = [];
        this.__rendering__ = false;
    }
    Panel.prototype.onCreate = function () { };
    Panel.prototype.onDestroy = function () { };
    Panel.prototype.onShow = function () { };
    Panel.prototype.onHidden = function () { };
    Panel.prototype.addHeadView = function (type, v) {
        var map = this.headviews.get(type);
        if (map) {
            map.set(v.viewId, v);
        }
        else {
            map = new Map;
            map.set(v.viewId, v);
            this.headviews.set(type, map);
        }
    };
    Panel.prototype.allHeadViews = function () {
        return this.headviews.values();
    };
    Panel.prototype.removeHeadView = function (type, v) {
        if (this.headviews.has(type)) {
            var map = this.headviews.get(type);
            if (map) {
                if (v instanceof View) {
                    map.delete(v.viewId);
                }
                else {
                    map.delete(v);
                }
            }
        }
    };
    Panel.prototype.clearHeadViews = function (type) {
        if (this.headviews.has(type)) {
            this.headviews.delete(type);
        }
    };
    Panel.prototype.getRootView = function () {
        return this.__root__;
    };
    Panel.prototype.getInitData = function () {
        return this.__data__;
    };
    Panel.prototype.__init__ = function (data) {
        if (data) {
            this.__data__ = JSON.parse(data);
        }
    };
    Panel.prototype.__onCreate__ = function () {
        this.onCreate();
    };
    Panel.prototype.__onDestroy__ = function () {
        this.destroyed = true;
        this.onDestroy();
    };
    Panel.prototype.__onShow__ = function () {
        this.onShow();
    };
    Panel.prototype.__onHidden__ = function () {
        this.onHidden();
    };
    Panel.prototype.__build__ = function (frame) {
        this.__root__.width = frame.width;
        this.__root__.height = frame.height;
        this.__root__.children.length = 0;
        this.build(this.__root__);
    };
    Panel.prototype.__response__ = function (viewIds, callbackId) {
        var arguments$1 = arguments;

        var v = this.retrospectView(viewIds);
        if (v === undefined) {
            loge("Cannot find view for " + viewIds);
        }
        else {
            var argumentsList = [callbackId];
            for (var i = 2; i < arguments.length; i++) {
                argumentsList.push(arguments$1[i]);
            }
            return Reflect.apply(v.responseCallback, v, argumentsList);
        }
    };
    Panel.prototype.retrospectView = function (ids) {
        var _this = this;
        return ids.reduce(function (acc, cur) {
            var e_1, _a;
            if (acc === undefined) {
                if (cur === _this.__root__.viewId) {
                    return _this.__root__;
                }
                try {
                    for (var _b = __values$2(_this.headviews.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var map = _c.value;
                        if (map.has(cur)) {
                            return map.get(cur);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) { _a.call(_b); }
                    }
                    finally { if (e_1) { throw e_1.error; } }
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
    };
    Panel.prototype.nativeRender = function (model) {
        return this.context.callNative("shader", "render", model);
    };
    Panel.prototype.hookBeforeNativeCall = function () {
        var e_2, _a, e_3, _b;
        if (Environment.platform !== 'web') {
            this.__root__.clean();
            try {
                for (var _c = __values$2(this.headviews.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var map = _d.value;
                    try {
                        for (var _e = (e_3 = void 0, __values$2(map.values())), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var v = _f.value;
                            v.clean();
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) { _b.call(_e); }
                        }
                        finally { if (e_3) { throw e_3.error; } }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) { _a.call(_c); }
                }
                finally { if (e_2) { throw e_2.error; } }
            }
        }
    };
    Panel.prototype.hookAfterNativeCall = function () {
        var e_4, _a, e_5, _b;
        var _this = this;
        if (this.destroyed) {
            return;
        }
        var promises = [];
        if (Environment.platform !== 'web') {
            //Here insert a native call to ensure the promise is resolved done.
            nativeEmpty();
            if (this.__root__.isDirty()) {
                var model = this.__root__.toModel();
                promises.push(this.nativeRender(model));
            }
            try {
                for (var _c = __values$2(this.headviews.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var map = _d.value;
                    try {
                        for (var _e = (e_5 = void 0, __values$2(map.values())), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var v = _f.value;
                            if (v.isDirty()) {
                                var model = v.toModel();
                                promises.push(this.nativeRender(model));
                            }
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) { _b.call(_e); }
                        }
                        finally { if (e_5) { throw e_5.error; } }
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) { _a.call(_c); }
                }
                finally { if (e_4) { throw e_4.error; } }
            }
        }
        else {
            Promise.resolve().then(function () {
                var e_6, _a, e_7, _b;
                if (_this.__root__.isDirty()) {
                    var model = _this.__root__.toModel();
                    promises.push(_this.nativeRender(model));
                    _this.__root__.clean();
                }
                try {
                    for (var _c = __values$2(_this.headviews.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var map = _d.value;
                        try {
                            for (var _e = (e_7 = void 0, __values$2(map.values())), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var v = _f.value;
                                if (v.isDirty()) {
                                    var model = v.toModel();
                                    promises.push(_this.nativeRender(model));
                                    v.clean();
                                }
                            }
                        }
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) { _b.call(_e); }
                            }
                            finally { if (e_7) { throw e_7.error; } }
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) { _a.call(_c); }
                    }
                    finally { if (e_6) { throw e_6.error; } }
                }
            });
        }
        if (this.__rendering__) {
            //skip
            Promise.all(promises).then(function (_) {
            });
        }
        else {
            this.__rendering__ = true;
            Promise.all(promises).then(function (_) {
                _this.__rendering__ = false;
                _this.onRenderFinished();
            });
        }
    };
    Panel.prototype.onRenderFinished = function () {
        this.onRenderFinishedCallback.forEach(function (e) {
            e();
        });
        this.onRenderFinishedCallback.length = 0;
    };
    Panel.prototype.addOnRenderFinishedCallback = function (cb) {
        this.onRenderFinishedCallback.push(cb);
    };
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
}());

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
var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values$3 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) { return m.call(o); }
    if (o && typeof o.length === "number") { return {
        next: function () {
            if (o && i >= o.length) { o = void 0; }
            return { value: o && o[i++], done: !o };
        }
    }; }
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
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
var Animation = /** @class */ (function () {
    function Animation() {
        this.changeables = new Map;
        this.duration = 0;
        this.fillMode = FillMode.Forward;
    }
    Animation.prototype.toModel = function () {
        var e_1, _a;
        var changeables = [];
        try {
            for (var _b = __values$3(this.changeables.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var e = _c.value;
                changeables.push({
                    key: e.key,
                    fromValue: e.fromValue,
                    toValue: e.toValue,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) { _a.call(_b); }
            }
            finally { if (e_1) { throw e_1.error; } }
        }
        return {
            type: this.constructor.name,
            delay: this.delay,
            duration: this.duration,
            changeables: changeables,
            repeatCount: this.repeatCount,
            repeatMode: this.repeatMode,
            fillMode: this.fillMode,
            timingFunction: this.timingFunction
        };
    };
    return Animation;
}());
var ScaleAnimation = /** @class */ (function (_super) {
    __extends$2(ScaleAnimation, _super);
    function ScaleAnimation() {
        var _this = _super.call(this) || this;
        _this.scaleXChangeable = {
            key: "scaleX",
            fromValue: 1,
            toValue: 1,
        };
        _this.scaleYChangeable = {
            key: "scaleY",
            fromValue: 1,
            toValue: 1,
        };
        _this.changeables.set("scaleX", _this.scaleXChangeable);
        _this.changeables.set("scaleY", _this.scaleYChangeable);
        return _this;
    }
    Object.defineProperty(ScaleAnimation.prototype, "fromScaleX", {
        get: function () {
            return this.scaleXChangeable.fromValue;
        },
        set: function (v) {
            this.scaleXChangeable.fromValue = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScaleAnimation.prototype, "toScaleX", {
        get: function () {
            return this.scaleXChangeable.toValue;
        },
        set: function (v) {
            this.scaleXChangeable.toValue = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScaleAnimation.prototype, "fromScaleY", {
        get: function () {
            return this.scaleYChangeable.fromValue;
        },
        set: function (v) {
            this.scaleYChangeable.fromValue = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScaleAnimation.prototype, "toScaleY", {
        get: function () {
            return this.scaleYChangeable.toValue;
        },
        set: function (v) {
            this.scaleYChangeable.toValue = v;
        },
        enumerable: false,
        configurable: true
    });
    return ScaleAnimation;
}(Animation));
var TranslationAnimation = /** @class */ (function (_super) {
    __extends$2(TranslationAnimation, _super);
    function TranslationAnimation() {
        var _this = _super.call(this) || this;
        _this.translationXChangeable = {
            key: "translationX",
            fromValue: 1,
            toValue: 1,
        };
        _this.translationYChangeable = {
            key: "translationY",
            fromValue: 1,
            toValue: 1,
        };
        _this.changeables.set("translationX", _this.translationXChangeable);
        _this.changeables.set("translationY", _this.translationYChangeable);
        return _this;
    }
    Object.defineProperty(TranslationAnimation.prototype, "fromTranslationX", {
        get: function () {
            return this.translationXChangeable.fromValue;
        },
        set: function (v) {
            this.translationXChangeable.fromValue = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TranslationAnimation.prototype, "toTranslationX", {
        get: function () {
            return this.translationXChangeable.toValue;
        },
        set: function (v) {
            this.translationXChangeable.toValue = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TranslationAnimation.prototype, "fromTranslationY", {
        get: function () {
            return this.translationYChangeable.fromValue;
        },
        set: function (v) {
            this.translationYChangeable.fromValue = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TranslationAnimation.prototype, "toTranslationY", {
        get: function () {
            return this.translationYChangeable.toValue;
        },
        set: function (v) {
            this.translationYChangeable.toValue = v;
        },
        enumerable: false,
        configurable: true
    });
    return TranslationAnimation;
}(Animation));
var RotationAnimation = /** @class */ (function (_super) {
    __extends$2(RotationAnimation, _super);
    function RotationAnimation() {
        var _this = _super.call(this) || this;
        _this.rotationChaneable = {
            key: "rotation",
            fromValue: 1,
            toValue: 1,
        };
        _this.changeables.set("rotation", _this.rotationChaneable);
        return _this;
    }
    Object.defineProperty(RotationAnimation.prototype, "fromRotation", {
        get: function () {
            return this.rotationChaneable.fromValue;
        },
        set: function (v) {
            this.rotationChaneable.fromValue = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RotationAnimation.prototype, "toRotation", {
        get: function () {
            return this.rotationChaneable.toValue;
        },
        set: function (v) {
            this.rotationChaneable.toValue = v;
        },
        enumerable: false,
        configurable: true
    });
    return RotationAnimation;
}(Animation));
var AnimationSet = /** @class */ (function () {
    function AnimationSet() {
        this.animations = [];
        this._duration = 0;
    }
    AnimationSet.prototype.addAnimation = function (anim) {
        this.animations.push(anim);
    };
    Object.defineProperty(AnimationSet.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        set: function (v) {
            this._duration = v;
            this.animations.forEach(function (e) { return e.duration = v; });
        },
        enumerable: false,
        configurable: true
    });
    AnimationSet.prototype.toModel = function () {
        return {
            animations: this.animations.map(function (e) {
                return e.toModel();
            }),
            delay: this.delay,
        };
    };
    return AnimationSet;
}());

/**
 *  Store color as format AARRGGBB or RRGGBB
 */
var Color = /** @class */ (function () {
    function Color(v) {
        this._value = 0;
        this._value = v | 0x0;
    }
    Color.parse = function (str) {
        if (!str.startsWith("#")) {
            throw new Error("Parse color error with " + str);
        }
        var val = parseInt(str.substr(1), 16);
        if (str.length === 7) {
            return new Color(val | 0xff000000);
        }
        else if (str.length === 9) {
            return new Color(val);
        }
        else {
            throw new Error("Parse color error with " + str);
        }
    };
    Color.safeParse = function (str, defVal) {
        if (defVal === void 0) { defVal = Color.TRANSPARENT; }
        var color = defVal;
        try {
            color = Color.parse(str);
        }
        catch (e) {
        }
        finally {
            return color;
        }
    };
    Color.prototype.alpha = function (v) {
        v = v * 255;
        return new Color((this._value & 0xffffff) | ((v & 0xff) << 24));
    };
    Color.prototype.toModel = function () {
        return this._value;
    };
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
}());
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

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$3 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var TruncateAt;
(function (TruncateAt) {
    TruncateAt[TruncateAt["End"] = 0] = "End";
    TruncateAt[TruncateAt["Middle"] = 1] = "Middle";
    TruncateAt[TruncateAt["Start"] = 2] = "Start";
    TruncateAt[TruncateAt["Clip"] = 3] = "Clip";
})(TruncateAt || (TruncateAt = {}));
var Text = /** @class */ (function (_super) {
    __extends$3(Text, _super);
    function Text() {
        return _super !== null && _super.apply(this, arguments) || this;
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
}(View));

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$4 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var ScaleType;
(function (ScaleType) {
    ScaleType[ScaleType["ScaleToFill"] = 0] = "ScaleToFill";
    ScaleType[ScaleType["ScaleAspectFit"] = 1] = "ScaleAspectFit";
    ScaleType[ScaleType["ScaleAspectFill"] = 2] = "ScaleAspectFill";
})(ScaleType || (ScaleType = {}));
var Image = /** @class */ (function (_super) {
    __extends$4(Image, _super);
    function Image() {
        return _super !== null && _super.apply(this, arguments) || this;
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
}(View));

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
var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$5 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) { return o; }
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) { ar.push(r.value); }
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) { m.call(i); }
        }
        finally { if (e) { throw e.error; } }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    var arguments$1 = arguments;

    for (var ar = [], i = 0; i < arguments.length; i++) { ar = ar.concat(__read(arguments$1[i])); }
    return ar;
};
var ListItem = /** @class */ (function (_super) {
    __extends$5(ListItem, _super);
    function ListItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        Property,
        __metadata$5("design:type", String)
    ], ListItem.prototype, "identifier", void 0);
    return ListItem;
}(Stack));
var List = /** @class */ (function (_super) {
    __extends$5(List, _super);
    function List() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cachedViews = new Map;
        _this.ignoreDirtyCallOnce = false;
        _this.itemCount = 0;
        _this.batchCount = 15;
        return _this;
    }
    List.prototype.allSubviews = function () {
        if (this.loadMoreView) {
            return __spread(this.cachedViews.values(), [this.loadMoreView]);
        }
        else {
            return this.cachedViews.values();
        }
    };
    List.prototype.scrollToItem = function (context, index, config) {
        var animated = config === null || config === void 0 ? void 0 : config.animated;
        return this.nativeChannel(context, 'scrollToItem')({ index: index, animated: animated, });
    };
    List.prototype.reset = function () {
        this.cachedViews.clear();
        this.itemCount = 0;
    };
    List.prototype.getItem = function (itemIdx) {
        var view = this.renderItem(itemIdx);
        view.superview = this;
        this.cachedViews.set("" + itemIdx, view);
        return view;
    };
    List.prototype.isDirty = function () {
        if (this.ignoreDirtyCallOnce) {
            this.ignoreDirtyCallOnce = false;
            //Ignore the dirty call once.
            return false;
        }
        return _super.prototype.isDirty.call(this);
    };
    List.prototype.renderBunchedItems = function (start, length) {
        var _this = this;
        this.ignoreDirtyCallOnce = true;
        return new Array(Math.max(0, Math.min(length, this.itemCount - start))).fill(0).map(function (_, idx) {
            var listItem = _this.getItem(start + idx);
            return listItem.toModel();
        });
    };
    List.prototype.toModel = function () {
        if (this.loadMoreView) {
            this.dirtyProps['loadMoreView'] = this.loadMoreView.viewId;
        }
        return _super.prototype.toModel.call(this);
    };
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
}(Superview));

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$6 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var SlideItem = /** @class */ (function (_super) {
    __extends$6(SlideItem, _super);
    function SlideItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$6([
        Property,
        __metadata$6("design:type", String)
    ], SlideItem.prototype, "identifier", void 0);
    return SlideItem;
}(Stack));
var Slider = /** @class */ (function (_super) {
    __extends$6(Slider, _super);
    function Slider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cachedViews = new Map;
        _this.ignoreDirtyCallOnce = false;
        _this.itemCount = 0;
        _this.batchCount = 3;
        return _this;
    }
    Slider.prototype.allSubviews = function () {
        return this.cachedViews.values();
    };
    Slider.prototype.getItem = function (itemIdx) {
        var view = this.renderPage(itemIdx);
        view.superview = this;
        this.cachedViews.set("" + itemIdx, view);
        return view;
    };
    Slider.prototype.isDirty = function () {
        if (this.ignoreDirtyCallOnce) {
            this.ignoreDirtyCallOnce = false;
            //Ignore the dirty call once.
            return false;
        }
        return _super.prototype.isDirty.call(this);
    };
    Slider.prototype.renderBunchedItems = function (start, length) {
        var _this = this;
        this.ignoreDirtyCallOnce = true;
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map(function (_, idx) {
            var slideItem = _this.getItem(start + idx);
            return slideItem.toModel();
        });
    };
    Slider.prototype.slidePage = function (context, page, smooth) {
        if (smooth === void 0) { smooth = false; }
        return this.nativeChannel(context, "slidePage")({ page: page, smooth: smooth });
    };
    Slider.prototype.getSlidedPage = function (context) {
        return this.nativeChannel(context, "getSlidedPage")();
    };
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
}(Superview));

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$7 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var Scroller = /** @class */ (function (_super) {
    __extends$7(Scroller, _super);
    function Scroller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Scroller.prototype.allSubviews = function () {
        return [this.content];
    };
    Scroller.prototype.toModel = function () {
        this.dirtyProps.content = this.content.viewId;
        return _super.prototype.toModel.call(this);
    };
    Scroller.prototype.scrollTo = function (context, offset, animated) {
        return this.nativeChannel(context, "scrollTo")({ offset: offset, animated: animated });
    };
    Scroller.prototype.scrollBy = function (context, offset, animated) {
        return this.nativeChannel(context, "scrollBy")({ offset: offset, animated: animated });
    };
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
}(Superview));

var __extends$8 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$8 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var Refreshable = /** @class */ (function (_super) {
    __extends$8(Refreshable, _super);
    function Refreshable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Refreshable.prototype.allSubviews = function () {
        var ret = [this.content];
        if (this.header) {
            ret.push(this.header);
        }
        return ret;
    };
    Refreshable.prototype.setRefreshable = function (context, refreshable) {
        return this.nativeChannel(context, 'setRefreshable')(refreshable);
    };
    Refreshable.prototype.setRefreshing = function (context, refreshing) {
        return this.nativeChannel(context, 'setRefreshing')(refreshing);
    };
    Refreshable.prototype.isRefreshable = function (context) {
        return this.nativeChannel(context, 'isRefreshable')();
    };
    Refreshable.prototype.isRefreshing = function (context) {
        return this.nativeChannel(context, 'isRefreshing')();
    };
    Refreshable.prototype.toModel = function () {
        this.dirtyProps.content = this.content.viewId;
        this.dirtyProps.header = (this.header || {}).viewId;
        return _super.prototype.toModel.call(this);
    };
    __decorate$8([
        Property,
        __metadata$8("design:type", Function)
    ], Refreshable.prototype, "onRefresh", void 0);
    return Refreshable;
}(Superview));

var ValueType;
(function (ValueType) {
    ValueType[ValueType["Undefined"] = 0] = "Undefined";
    ValueType[ValueType["Point"] = 1] = "Point";
    ValueType[ValueType["Percent"] = 2] = "Percent";
    ValueType[ValueType["Auto"] = 3] = "Auto";
})(ValueType || (ValueType = {}));
var FlexTypedValue = /** @class */ (function () {
    function FlexTypedValue(type) {
        this.value = 0;
        this.type = type;
    }
    FlexTypedValue.percent = function (v) {
        var ret = new FlexTypedValue(ValueType.Percent);
        ret.value = v;
        return ret;
    };
    FlexTypedValue.point = function (v) {
        var ret = new FlexTypedValue(ValueType.Point);
        ret.value = v;
        return ret;
    };
    FlexTypedValue.prototype.toModel = function () {
        return {
            type: this.type,
            value: this.value,
        };
    };
    FlexTypedValue.Auto = new FlexTypedValue(ValueType.Auto);
    return FlexTypedValue;
}());
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

var __extends$9 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$9 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var __read$1 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) { return o; }
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) { ar.push(r.value); }
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) { m.call(i); }
        }
        finally { if (e) { throw e.error; } }
    }
    return ar;
};
var __spread$1 = (undefined && undefined.__spread) || function () {
    var arguments$1 = arguments;

    for (var ar = [], i = 0; i < arguments.length; i++) { ar = ar.concat(__read$1(arguments$1[i])); }
    return ar;
};
var FlowLayoutItem = /** @class */ (function (_super) {
    __extends$9(FlowLayoutItem, _super);
    function FlowLayoutItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$9([
        Property,
        __metadata$9("design:type", String)
    ], FlowLayoutItem.prototype, "identifier", void 0);
    return FlowLayoutItem;
}(Stack));
var FlowLayout = /** @class */ (function (_super) {
    __extends$9(FlowLayout, _super);
    function FlowLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cachedViews = new Map;
        _this.ignoreDirtyCallOnce = false;
        _this.columnCount = 2;
        _this.itemCount = 0;
        _this.batchCount = 15;
        return _this;
    }
    FlowLayout.prototype.allSubviews = function () {
        if (this.loadMoreView) {
            return __spread$1(this.cachedViews.values(), [this.loadMoreView]);
        }
        else {
            return this.cachedViews.values();
        }
    };
    FlowLayout.prototype.reset = function () {
        this.cachedViews.clear();
        this.itemCount = 0;
    };
    FlowLayout.prototype.getItem = function (itemIdx) {
        var view = this.renderItem(itemIdx);
        view.superview = this;
        this.cachedViews.set("" + itemIdx, view);
        return view;
    };
    FlowLayout.prototype.isDirty = function () {
        if (this.ignoreDirtyCallOnce) {
            this.ignoreDirtyCallOnce = false;
            //Ignore the dirty call once.
            return false;
        }
        return _super.prototype.isDirty.call(this);
    };
    FlowLayout.prototype.renderBunchedItems = function (start, length) {
        var _this = this;
        this.ignoreDirtyCallOnce = true;
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map(function (_, idx) {
            var listItem = _this.getItem(start + idx);
            return listItem.toModel();
        });
    };
    FlowLayout.prototype.toModel = function () {
        if (this.loadMoreView) {
            this.dirtyProps['loadMoreView'] = this.loadMoreView.viewId;
        }
        return _super.prototype.toModel.call(this);
    };
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
}(Superview));

var __extends$a = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$a = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$a = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var Input = /** @class */ (function (_super) {
    __extends$a(Input, _super);
    function Input() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Input.prototype.getText = function (context) {
        return this.nativeChannel(context, 'getText')();
    };
    Input.prototype.setSelection = function (context, start, end) {
        if (end === void 0) { end = start; }
        return this.nativeChannel(context, 'setSelection')({
            start: start,
            end: end,
        });
    };
    Input.prototype.requestFocus = function (context) {
        return this.nativeChannel(context, 'requestFocus')();
    };
    Input.prototype.releaseFocus = function (context) {
        return this.nativeChannel(context, 'releaseFocus')();
    };
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
}(View));

var __extends$b = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$b = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$b = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var NestedSlider = /** @class */ (function (_super) {
    __extends$b(NestedSlider, _super);
    function NestedSlider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NestedSlider.prototype.addSlideItem = function (view) {
        this.addChild(view);
    };
    NestedSlider.prototype.slidePage = function (context, page, smooth) {
        if (smooth === void 0) { smooth = false; }
        return this.nativeChannel(context, "slidePage")({ page: page, smooth: smooth });
    };
    NestedSlider.prototype.getSlidedPage = function (context) {
        return this.nativeChannel(context, "getSlidedPage")();
    };
    __decorate$b([
        Property,
        __metadata$b("design:type", Function)
    ], NestedSlider.prototype, "onPageSlided", void 0);
    return NestedSlider;
}(Group));

var __extends$c = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$c = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$c = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var Draggable = /** @class */ (function (_super) {
    __extends$c(Draggable, _super);
    function Draggable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$c([
        Property,
        __metadata$c("design:type", Function)
    ], Draggable.prototype, "onDrag", void 0);
    return Draggable;
}(Stack));

var __extends$d = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$d = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$d = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") { return Reflect.metadata(k, v); }
};
var Switch = /** @class */ (function (_super) {
    __extends$d(Switch, _super);
    function Switch() {
        return _super !== null && _super.apply(this, arguments) || this;
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
}(View));

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) { throw t[1]; } return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) { throw new TypeError("Generator is already executing."); }
        while (_) { try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) { return t; }
            if (y = 0, t) { op = [op[0] & 2, t.value]; }
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) { _.ops.pop(); }
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; } }
        if (op[0] & 5) { throw op[1]; } return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values$4 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) { return m.call(o); }
    if (o && typeof o.length === "number") { return {
        next: function () {
            if (o && i >= o.length) { o = void 0; }
            return { value: o && o[i++], done: !o };
        }
    }; }
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

var StatusBarMode;
(function (StatusBarMode) {
    StatusBarMode[StatusBarMode["LIGHT"] = 0] = "LIGHT";
    StatusBarMode[StatusBarMode["DARK"] = 1] = "DARK";
})(StatusBarMode || (StatusBarMode = {}));

var __values$5 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) { return m.call(o); }
    if (o && typeof o.length === "number") { return {
        next: function () {
            if (o && i >= o.length) { o = void 0; }
            return { value: o && o[i++], done: !o };
        }
    }; }
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

var __extends$e = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var VMPanel = /** @class */ (function (_super) {
    __extends$e(VMPanel, _super);
    function VMPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VMPanel.prototype.getViewModel = function () {
        return this.vm;
    };
    VMPanel.prototype.build = function (root) {
        this.vh = new (this.getViewHolderClass());
        this.vm = new (this.getViewModelClass())(this.getState(), this.vh);
        this.vm.attach(root);
    };
    return VMPanel;
}(Panel));

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
