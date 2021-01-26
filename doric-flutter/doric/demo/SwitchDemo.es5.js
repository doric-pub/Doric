'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SwitchDemo = /*@__PURE__*/(function (Panel) {
    function SwitchDemo () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) SwitchDemo.__proto__ = Panel;
    SwitchDemo.prototype = Object.create( Panel && Panel.prototype );
    SwitchDemo.prototype.constructor = SwitchDemo;

    SwitchDemo.prototype.build = function build (rootView) {
        var switchStatus;
        doric.vlayout([
            switchStatus = doric.text({
                text: "Switch开关"
            }),
            doric.switchView({
                state: true,
                onSwitch: function (state) {
                    switchStatus.text = "Switch 当前状态:" + (state ? "ON" : "OFF");
                },
            }),
            doric.switchView({
                state: true,
                onSwitch: function (state) {
                    switchStatus.text = "Switch 当前状态:" + (state ? "ON" : "OFF");
                },
                // backgroundColor: Color.RED,
                offTintColor: doric.Color.RED,
                onTintColor: doric.Color.YELLOW,
            }) ], {
            layoutConfig: doric.layoutConfig().most(),
            space: 20,
            gravity: doric.Gravity.Center
        }).in(rootView);
    };

    return SwitchDemo;
}(doric.Panel));
SwitchDemo = __decorate([
    Entry
], SwitchDemo);
//# sourceMappingURL=SwitchDemo.es5.js.map
