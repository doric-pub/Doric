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
    test() {
        console.log('Invoke Success')
    }

    build(root) {
        root.addChild(doric.vlayout([
            doric.text({
                textSize: 40,
                layoutConfig: {
                    alignment: doric.Gravity.Center,
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT,
                },
            }).also(it => { this.number = it; }),
            doric.text({
                text: "点击计数",
                textSize: 20,
                border: {
                    width: 1,
                    color: doric.Color.parse('#000000'),
                },
                corners: 5,
                layoutConfig: {
                    alignment: doric.Gravity.Center,
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT,
                },
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                },
                shadow: {
                    color: doric.Color.parse("#00ff00"),
                    opacity: 0.5,
                    radius: 20,
                    offsetX: 10,
                    offsetY: 10,
                }
            }).also(it => { this.counter = it; }),
        ]).also(it => {
            it.width = 200;
            it.height = 200;
            it.space = 20;
            it.gravity = doric.Gravity.Center;
            it.layoutConfig = {
                alignment: doric.Gravity.Center
            };
            it.border = {
                width: 1,
                color: doric.Color.parse("#000000"),
            };
            it.shadow = {
                color: doric.Color.parse("#ffff00"),
                opacity: 0.5,
                radius: 20,
                offsetX: 10,
                offsetY: 10,
            };
            it.corners = 20;
            it.backgroundColor = doric.Color.parse('#ff00ff');
        }));
        root.addChild((new doric.Image).also(iv => {
            iv.imageUrl = "https://misc.aotu.io/ONE-SUNDAY/SteamEngine.png";
            iv.layoutConfig = {
                widthSpec: doric.LayoutSpec.FIT,
                heightSpec: doric.LayoutSpec.FIT,
            };
        }));
    }
}
class CounterVM extends doric.ViewModel {
    onAttached(s, vh) {
        vh.counter.onClick = () => {
            this.updateState(state => {
                state.count++;
            });
        };
    }
    onBind(s, vh) {
        vh.number.text = `${s.count}`;
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
