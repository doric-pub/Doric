'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CounterView = /*@__PURE__*/(function (ViewHolder) {
    function CounterView () {
        ViewHolder.apply(this, arguments);
    }

    if ( ViewHolder ) CounterView.__proto__ = ViewHolder;
    CounterView.prototype = Object.create( ViewHolder && ViewHolder.prototype );
    CounterView.prototype.constructor = CounterView;

    CounterView.prototype.build = function build (root) {
        doric.vlayout([
            doric.text({
                textSize: 40,
                tag: "tvNumber"
            }),
            doric.text({
                text: "Click To Count 1",
                textSize: 20,
                tag: "tvCounter"
            }) ], {
            layoutConfig: doric.layoutConfig().most(),
            gravity: doric.Gravity.Center,
            space: 20,
        }).in(root);
        this.number = root.findViewByTag("tvNumber");
        this.counter = root.findViewByTag("tvCounter");
    };

    return CounterView;
}(doric.ViewHolder));
var CounterVM = /*@__PURE__*/(function (ViewModel) {
    function CounterVM () {
        ViewModel.apply(this, arguments);
    }

    if ( ViewModel ) CounterVM.__proto__ = ViewModel;
    CounterVM.prototype = Object.create( ViewModel && ViewModel.prototype );
    CounterVM.prototype.constructor = CounterVM;

    CounterVM.prototype.onAttached = function onAttached (s, vh) {
        var this$1 = this;

        vh.counter.onClick = function () {
            this$1.updateState(function (state) {
                state.count++;
            });
        };
    };
    CounterVM.prototype.onBind = function onBind (s, vh) {
        vh.number.text = "" + (s.count);
    };

    return CounterVM;
}(doric.ViewModel));
var MyPage = /*@__PURE__*/(function (VMPanel) {
    function MyPage () {
        VMPanel.apply(this, arguments);
    }

    if ( VMPanel ) MyPage.__proto__ = VMPanel;
    MyPage.prototype = Object.create( VMPanel && VMPanel.prototype );
    MyPage.prototype.constructor = MyPage;

    MyPage.prototype.getViewHolderClass = function getViewHolderClass () {
        return CounterView;
    };
    MyPage.prototype.getViewModelClass = function getViewModelClass () {
        return CounterVM;
    };
    MyPage.prototype.getState = function getState () {
        return {
            count: 0
        };
    };

    return MyPage;
}(doric.VMPanel));
MyPage = __decorate([
    Entry
], MyPage);
//# sourceMappingURL=Counter.es5.js.map
