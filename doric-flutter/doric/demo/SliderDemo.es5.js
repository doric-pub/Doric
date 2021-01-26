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
var imageUrls = [
    'http://b.hiphotos.baidu.com/image/pic/item/908fa0ec08fa513db777cf78376d55fbb3fbd9b3.jpg',
    'http://f.hiphotos.baidu.com/image/pic/item/0e2442a7d933c8956c0e8eeadb1373f08202002a.jpg',
    'http://f.hiphotos.baidu.com/image/pic/item/b151f8198618367aa7f3cc7424738bd4b31ce525.jpg',
    'http://b.hiphotos.baidu.com/image/pic/item/0eb30f2442a7d9337119f7dba74bd11372f001e0.jpg',
    'http://a.hiphotos.baidu.com/image/h%3D300/sign=b38f3fc35b0fd9f9bf175369152cd42b/9a504fc2d5628535bdaac29e9aef76c6a6ef63c2.jpg',
    'http://h.hiphotos.baidu.com/image/pic/item/810a19d8bc3eb1354c94a704ac1ea8d3fd1f4439.jpg',
    'http://calonye.com/wp-content/uploads/2015/08/0-wx_fmtgiftpwebpwxfrom5wx_lazy1-9.gif',
    'http://hbimg.b0.upaiyun.com/ca29ea125b7f2d580f573e48eb594b1ef509757f34a08-m0hK45_fw658',
    'https://misc.aotu.io/ONE-SUNDAY/SteamEngine.png' ];
var SliderPanel = /*@__PURE__*/(function (Panel) {
    function SliderPanel () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) SliderPanel.__proto__ = Panel;
    SliderPanel.prototype = Object.create( Panel && Panel.prototype );
    SliderPanel.prototype.constructor = SliderPanel;

    SliderPanel.prototype.build = function build (rootView) {
        var pager = doric.slider({
            itemCount: imageUrls.length,
            renderPage: function (idx) {
                return doric.slideItem(doric.image({
                    imageUrl: imageUrls[idx % imageUrls.length],
                    scaleType: doric.ScaleType.ScaleAspectFit,
                    layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST).configHeight(doric.LayoutSpec.MOST).configAlignment(doric.gravity().center()),
                })).also(function (it) {
                    var start = idx;
                    it.onClick = function () {
                        it.backgroundColor = (colors[++start % colors.length]);
                    };
                });
            },
            layoutConfig: {
                widthSpec: doric.LayoutSpec.MOST,
                heightSpec: doric.LayoutSpec.MOST,
                weight: 1,
            },
        });
        rootView.addChild(doric.vlayout([
            doric.text({
                text: "Gallery",
                layoutConfig: {
                    widthSpec: doric.LayoutSpec.MOST,
                    heightSpec: doric.LayoutSpec.JUST,
                },
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[1],
                textAlignment: doric.gravity().center(),
                height: 50,
            }),
            doric.hlayout([
                doric.text({
                    text: "Loop",
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.FIT,
                        heightSpec: doric.LayoutSpec.JUST,
                    },
                    textSize: 20,
                    textColor: doric.Color.BLACK,
                    textAlignment: doric.gravity().center(),
                    height: 50,
                }),
                doric.switchView({
                    state: false,
                    onSwitch: function (state) {
                        pager.loop = state;
                    },
                }) ], {
                layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT),
                gravity: doric.gravity().center(),
                space: 10,
                backgroundColor: doric.Color.RED,
            }),
            pager ]).also(function (it) {
            it.layoutConfig = {
                widthSpec: doric.LayoutSpec.MOST,
                heightSpec: doric.LayoutSpec.MOST,
            };
        }));
    };

    return SliderPanel;
}(doric.Panel));
SliderPanel = __decorate([
    Entry
], SliderPanel);
//# sourceMappingURL=SliderDemo.es5.js.map
