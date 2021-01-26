'use strict';

var doric = require('doric');

var colors = [
    "#70a1ff",
    "#7bed9f",
    "#ff6b81",
    "#a4b0be",
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b" ].map(function (e) { return doric.Color.parse(e); });
function label(str) {
    return doric.text({
        text: str,
        textSize: 16,
    });
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NaivgatorDemo = /*@__PURE__*/(function (Panel) {
    function NaivgatorDemo () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) NaivgatorDemo.__proto__ = Panel;
    NaivgatorDemo.prototype = Object.create( Panel && Panel.prototype );
    NaivgatorDemo.prototype.constructor = NaivgatorDemo;

    NaivgatorDemo.prototype.build = function build (root) {
        if (this.getInitData()) {
            doric.modal(context).alert(("Init Data :" + (JSON.stringify(this.getInitData()))));
        }
        doric.scroller(doric.vlayout([
            doric.text({
                text: "Navigator Demo",
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[1],
                textAlignment: doric.gravity().center(),
                height: 50,
            }) ].concat( [
                'NavbarDemo',
                'Counter', 'EffectsDemo', 'ImageDemo', 'LayoutDemo',
                'ListDemo', 'ModalDemo', 'NavigatorDemo',
                'NetworkDemo', 'ScrollerDemo', 'SliderDemo', 'Snake', 'StorageDemo', 'PopoverDemo'
            ].map(function (e) { return label(e).apply({
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just().configWidth(doric.LayoutSpec.MOST),
                onClick: function () {
                    doric.navigator(context).push(("assets://src/" + e + ".js"), {
                        alias: (e + ".js"),
                        extra: {
                            from: "navigatorDemo"
                        },
                    });
                },
            }); }),
            [label('POP').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.navigator(context).pop();
                },
            })],
            [label('OpenURL').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.navigator(context).openUrl("https://doric.pub");
                },
            })] )).apply({
            layoutConfig: doric.layoutConfig().most(),
            width: Environment.screenWidth,
            gravity: doric.gravity().center(),
            space: 10,
        })).apply({
            layoutConfig: doric.layoutConfig().most(),
        }).in(root);
    };

    return NaivgatorDemo;
}(doric.Panel));
NaivgatorDemo = __decorate([
    Entry
], NaivgatorDemo);
//# sourceMappingURL=NavigatorDemo.es5.js.map
