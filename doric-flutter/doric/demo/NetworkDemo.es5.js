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
function title(str) {
    return doric.text({
        text: str,
        layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
        textSize: 30,
        textColor: doric.Color.WHITE,
        backgroundColor: colors[1],
        textAlignment: doric.gravity().center(),
        height: 50,
    });
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NetworkDemo = /*@__PURE__*/(function (Panel) {
    function NetworkDemo () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) NetworkDemo.__proto__ = Panel;
    NetworkDemo.prototype = Object.create( Panel && Panel.prototype );
    NetworkDemo.prototype.constructor = NetworkDemo;

    NetworkDemo.prototype.build = function build (rootView) {
        doric.scroller(doric.vlayout([
            title("Network Demo"),
            label('Click me').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.network(context).get('https://m.baidu.com').then(function (e) {
                        doric.modal(context).alert(JSON.stringify(e));
                    }).catch(function (e) {
                        doric.modal(context).toast('Catched:' + JSON.stringify(e));
                    });
                }
            }) ]).apply({
            layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT),
            gravity: doric.gravity().center(),
            space: 10,
        })).apply({
            layoutConfig: doric.layoutConfig().most(),
        }).in(rootView);
    };

    return NetworkDemo;
}(doric.Panel));
NetworkDemo = __decorate([
    Entry
], NetworkDemo);
//# sourceMappingURL=NetworkDemo.es5.js.map
