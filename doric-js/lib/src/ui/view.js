var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { obj2Model } from "../util/types";
import { uniqueId } from "../util/uniqueId";
import { loge } from "../util/log";
const PROP_CONSIST = 1;
const PROP_INCONSIST = 2;
const PROP_KEY_VIEW_TYPE = "ViewType";
export function Property(target, propKey) {
    Reflect.defineMetadata(propKey, PROP_CONSIST, target);
}
export function InconsistProperty(target, propKey) {
    Reflect.defineMetadata(propKey, PROP_INCONSIST, target);
}
export function ViewComponent(constructor) {
    const name = Reflect.getMetadata(PROP_KEY_VIEW_TYPE, constructor) || Object.getPrototypeOf(constructor).name;
    Reflect.defineMetadata(PROP_KEY_VIEW_TYPE, name, constructor);
}
export class View {
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
    __metadata("design:type", Number)
], View.prototype, "rotationX", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], View.prototype, "rotationY", void 0);
__decorate([
    Property,
    __metadata("design:type", Number)
], View.prototype, "perspective", void 0);
__decorate([
    Property,
    __metadata("design:type", Object)
], View.prototype, "flexConfig", void 0);
export class Superview extends View {
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
export class Group extends Superview {
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
    removeChild(view) {
        const ret = this.children.filter(e => e !== view);
        this.children.length = 0;
        ret.forEach(e => this.addChild(e));
    }
    removeAllChildren() {
        this.children.length = 0;
    }
}
