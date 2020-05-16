var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Property, Superview } from "../ui/view";
import { layoutConfig } from "../util/layoutconfig";
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
    __decorate([
        Property,
        __metadata("design:type", Function)
    ], Refreshable.prototype, "onRefresh", void 0);
    return Refreshable;
})();
export { Refreshable };
export function refreshable(config) {
    const ret = new Refreshable;
    ret.layoutConfig = layoutConfig().fit();
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}
export function pullable(v, config) {
    Reflect.set(v, 'startAnimation', config.startAnimation);
    Reflect.set(v, 'stopAnimation', config.stopAnimation);
    Reflect.set(v, 'setPullingDistance', config.setPullingDistance);
    return v;
}
