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
    constructor() {
        super(...arguments);
        this.number = new doric.Text;
        this.counter = new doric.Text;
    }
    build(root) {
        const vlayout = new doric.VLayout;
        vlayout.width = 200;
        vlayout.height = 200;
        vlayout.gravity = new doric.Gravity().center();
        this.number.textSize = 40;
        this.number.layoutConfig = {
            alignment: new doric.Gravity().center()
        };
        this.counter = new doric.Text;
        this.counter.text = "点击计数";
        this.counter.border = {
            width: 1,
            color: doric.Color.parse('#000000'),
        };
        this.counter.textSize = 20;
        this.counter.corners = 5;
        vlayout.space = 20;
        vlayout.layoutConfig = {
            alignment: new doric.Gravity().center()
        };
        vlayout.border = {
            width: 1,
            color: doric.Color.parse("#000000"),
        };
        this.counter.shadow = {
            color: doric.Color.parse("#00ff00"),
            opacity: 0.5,
            radius: 20,
            offsetX: 10,
            offsetY: 10,
        };
        vlayout.shadow = {
            color: doric.Color.parse("#ffff00"),
            opacity: 0.5,
            radius: 20,
            offsetX: 10,
            offsetY: 10,
        };
        vlayout.corners = 20;
        vlayout.addChild(this.number);
        vlayout.addChild(this.counter);
        // root.bgColor = Color.parse('#00ff00')
        vlayout.bgColor = doric.Color.parse('#ff00ff');
        root.addChild(vlayout);
        const iv = new doric.Image;
        // iv.width = iv.height = 100
        iv.imageUrl = "https://misc.aotu.io/ONE-SUNDAY/SteamEngine.png";
        //iv.bgColor = Color.parse('#00ff00')
        root.addChild(iv);
    }
    setNumber(n) {
        this.number.text = n.toString();
    }
    setCounter(v) {
        this.counter.onClick = v;
    }
}
class CounterVM extends doric.ViewModel {
    binding(v, model) {
        v.setNumber(model.count);
        v.setCounter(() => {
            this.getModel().count++;
        });
    }
}
let MyPage = class MyPage extends doric.VMPanel {
    getVMClass() {
        return CounterVM;
    }
    getModel() {
        return {
            count: 0,
            add: function () {
                this.count++;
            },
        };
    }
    getViewHolder() {
        return new CounterView;
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
