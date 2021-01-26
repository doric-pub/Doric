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

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FlowDemo = /*@__PURE__*/(function (Panel) {
    function FlowDemo () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) FlowDemo.__proto__ = Panel;
    FlowDemo.prototype = Object.create( Panel && Panel.prototype );
    FlowDemo.prototype.constructor = FlowDemo;

    FlowDemo.prototype.build = function build (rootView) {
        var flowView = doric.flowlayout({
            layoutConfig: doric.layoutConfig().most(),
            itemCount: 100,
            columnCount: 3,
            columnSpace: 10,
            rowSpace: 10,
            renderItem: function (idx) {
                return doric.flowItem(doric.text({
                    text: ("" + idx),
                    textColor: doric.Color.WHITE,
                    textSize: 20,
                    layoutConfig: doric.layoutConfig().fit().configAlignment(doric.Gravity.Center)
                }), {
                    backgroundColor: colors[idx % colors.length],
                    height: 50 + (idx % 3) * 20,
                    layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                });
            },
            loadMore: true,
            onLoadMore: function () {
                setTimeout(function () {
                    flowView.itemCount += 20;
                }, 1000);
            },
            loadMoreView: doric.flowItem(doric.text({
                text: 'load more',
                textColor: doric.Color.WHITE,
                textSize: 20,
                layoutConfig: doric.layoutConfig().fit().configAlignment(doric.Gravity.Center)
            }), {
                backgroundColor: colors[500 % colors.length],
                height: 50,
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
            })
        }).in(rootView);
    };

    return FlowDemo;
}(doric.Panel));
FlowDemo = __decorate([
    Entry
], FlowDemo);
//# sourceMappingURL=FlowLayoutDemo.es5.js.map
