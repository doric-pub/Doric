"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
require("reflect-metadata");
function Property(target, propKey) {
    Reflect.defineMetadata(propKey, true, target);
}
exports.Property = Property;
var View = /** @class */ (function () {
    function View() {
        var _this = this;
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        /** Anchor end*/
        this.__dirty_props__ = {};
        return new Proxy(this, {
            get: function (target, p) {
                return Reflect.get(target, p);
            },
            set: function (target, p, v) {
                var oldV = Reflect.get(target, p);
                var ret = Reflect.set(target, p, v);
                if (Reflect.getMetadata(p, target)) {
                    _this.onPropertyChanged(p.toString(), oldV, v);
                }
                return ret;
            }
        });
    }
    Object.defineProperty(View.prototype, "left", {
        /** Anchor start*/
        get: function () {
            return this.x;
        },
        set: function (v) {
            this.x = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "right", {
        get: function () {
            return this.x + this.width;
        },
        set: function (v) {
            this.x = v - this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "top", {
        get: function () {
            return this.y;
        },
        set: function (v) {
            this.y = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "bottom", {
        get: function () {
            return this.y + this.height;
        },
        set: function (v) {
            this.y = v - this.height;
        },
        enumerable: true,
        configurable: true
    });
    View.prototype.onPropertyChanged = function (propKey, oldV, newV) {
        if (newV instanceof Object
            && Reflect.has(newV, 'toModel')
            && Reflect.get(newV, 'toModel') instanceof Function) {
            newV = Reflect.apply(Reflect.get(newV, 'toModel'), newV, []);
        }
        this.__dirty_props__[propKey] = newV;
    };
    View.prototype.toModel = function () {
        return this.__dirty_props__ || {};
    };
    __decorate([
        Property
    ], View.prototype, "width");
    __decorate([
        Property
    ], View.prototype, "height");
    __decorate([
        Property
    ], View.prototype, "x");
    __decorate([
        Property
    ], View.prototype, "y");
    __decorate([
        Property
    ], View.prototype, "bgColor");
    __decorate([
        Property
    ], View.prototype, "corners");
    __decorate([
        Property
    ], View.prototype, "border");
    __decorate([
        Property
    ], View.prototype, "shadow");
    __decorate([
        Property
    ], View.prototype, "alpha");
    __decorate([
        Property
    ], View.prototype, "padding");
    __decorate([
        Property
    ], View.prototype, "config");
    return View;
}());
exports.View = View;
var Alignment;
(function (Alignment) {
    Alignment[Alignment["center"] = 0] = "center";
    Alignment[Alignment["start"] = 1] = "start";
    Alignment[Alignment["end"] = 2] = "end";
})(Alignment = exports.Alignment || (exports.Alignment = {}));
var Gravity;
(function (Gravity) {
    Gravity[Gravity["center"] = 0] = "center";
    Gravity[Gravity["left"] = 1] = "left";
    Gravity[Gravity["right"] = 2] = "right";
    Gravity[Gravity["top"] = 3] = "top";
    Gravity[Gravity["bottom"] = 4] = "bottom";
})(Gravity = exports.Gravity || (exports.Gravity = {}));
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = [];
        return _this;
    }
    __decorate([
        Property
    ], Group.prototype, "children");
    return Group;
}(View));
exports.Group = Group;
var Stack = /** @class */ (function (_super) {
    __extends(Stack, _super);
    function Stack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property
    ], Stack.prototype, "gravity");
    return Stack;
}(Group));
exports.Stack = Stack;
var LinearLayout = /** @class */ (function (_super) {
    __extends(LinearLayout, _super);
    function LinearLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property
    ], LinearLayout.prototype, "space");
    __decorate([
        Property
    ], LinearLayout.prototype, "gravity");
    return LinearLayout;
}(Group));
var VLayout = /** @class */ (function (_super) {
    __extends(VLayout, _super);
    function VLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VLayout;
}(LinearLayout));
exports.VLayout = VLayout;
var HLayout = /** @class */ (function (_super) {
    __extends(HLayout, _super);
    function HLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HLayout;
}(LinearLayout));
exports.HLayout = HLayout;
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property
    ], Text.prototype, "text");
    __decorate([
        Property
    ], Text.prototype, "textColor");
    __decorate([
        Property
    ], Text.prototype, "textSize");
    __decorate([
        Property
    ], Text.prototype, "maxLines");
    return Text;
}(View));
exports.Text = Text;
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property
    ], Image.prototype, "imageUrl");
    return Image;
}(View));
exports.Image = Image;
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return List;
}(View));
exports.List = List;
var Slide = /** @class */ (function (_super) {
    __extends(Slide, _super);
    function Slide() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Slide;
}(View));
exports.Slide = Slide;
