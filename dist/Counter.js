'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class CounterView extends doric.ViewHolder {
    build(root) {
        root.backgroundColor = doric.Color.BLUE;
    }
}
class CounterVM extends doric.ViewModel {
    onAttached(s, vh) {
    }
    onBind(s, vh) {
    }
}
let MyPage = class MyPage extends doric.VMPanel {
    getViewHolderClass() {
        return CounterView;
    }
    getViewModelClass() {
        return CounterVM;
    }
    getState() {
        return {
            count: 0
        };
    }
    log() {
        doric.log("Hello.HEGO");
        doric.logw("Hello.HEGO");
        doric.loge("Hello.HEGO");
        context.modal.toast('This is a toast.').then((r) => {
            doric.loge(r);
        });
    }
};
__decorate([
    doric.NativeCall,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MyPage.prototype, "log", null);
MyPage = __decorate([
    Entry
], MyPage);
//# sourceMappingURL=Counter.js.map
