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
var MyDemo = /*@__PURE__*/(function (Panel) {
    function MyDemo () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) MyDemo.__proto__ = Panel;
    MyDemo.prototype = Object.create( Panel && Panel.prototype );
    MyDemo.prototype.constructor = MyDemo;

    MyDemo.prototype.build = function build (root) {
        var refreshed;
        var headerImage;
        doric.stack([
            refreshed = doric.refreshable({
                onRefresh: function () {
                    refreshed.setRefreshing(context, false);
                },
                header: doric.pullable(doric.stack([]).apply({
                    backgroundColor: doric.Color.RED,
                    layoutConfig: doric.layoutConfig().just(),
                    width: 100,
                    height: 30,
                }), {
                    startAnimation: function () {
                    },
                    stopAnimation: function () {
                    },
                    setPullingDistance: function (distance) {
                        headerImage.scaleX = headerImage.scaleY = (headerImage.height + distance * 2) / headerImage.height;
                    },
                }),
                content: doric.list({
                    itemCount: 20,
                    renderItem: function (idx) {
                        return doric.listItem(doric.text({
                            text: ("Item :" + idx),
                            layoutConfig: doric.layoutConfig().just(),
                            width: root.width,
                            height: 50,
                            textColor: doric.Color.WHITE,
                            backgroundColor: colors[idx % colors.length],
                        }));
                    },
                    layoutConfig: doric.layoutConfig().most(),
                }),
                layoutConfig: doric.layoutConfig().most(),
            }).also(function (v) {
                v.top = 200;
            }),
            headerImage = doric.image({
                imageUrl: "https://img.zcool.cn/community/01e75b5da933daa801209e1ffa4649.jpg@1280w_1l_2o_100sh.jpg",
                layoutConfig: doric.layoutConfig().just(),
                width: root.width,
                height: 200,
                scaleType: doric.ScaleType.ScaleAspectFill,
            }) ], {
            layoutConfig: doric.layoutConfig().most()
        }).in(root);
    };

    return MyDemo;
}(doric.Panel));
MyDemo = __decorate([
    Entry
], MyDemo);
//# sourceMappingURL=ComplicatedDemo.es5.js.map
