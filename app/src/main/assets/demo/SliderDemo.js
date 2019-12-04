'use strict';

var doric = require('doric');

const colors = [
    "#70a1ff",
    "#7bed9f",
    "#ff6b81",
    "#a4b0be",
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
].map(e => doric.Color.parse(e));

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const imageUrls = [
    'http://b.hiphotos.baidu.com/image/pic/item/908fa0ec08fa513db777cf78376d55fbb3fbd9b3.jpg',
    'http://f.hiphotos.baidu.com/image/pic/item/0e2442a7d933c8956c0e8eeadb1373f08202002a.jpg',
    'http://f.hiphotos.baidu.com/image/pic/item/b151f8198618367aa7f3cc7424738bd4b31ce525.jpg',
    'http://b.hiphotos.baidu.com/image/pic/item/0eb30f2442a7d9337119f7dba74bd11372f001e0.jpg',
    'http://a.hiphotos.baidu.com/image/h%3D300/sign=b38f3fc35b0fd9f9bf175369152cd42b/9a504fc2d5628535bdaac29e9aef76c6a6ef63c2.jpg',
    'http://h.hiphotos.baidu.com/image/pic/item/810a19d8bc3eb1354c94a704ac1ea8d3fd1f4439.jpg',
    'http://calonye.com/wp-content/uploads/2015/08/0-wx_fmtgiftpwebpwxfrom5wx_lazy1-9.gif',
    'http://hbimg.b0.upaiyun.com/ca29ea125b7f2d580f573e48eb594b1ef509757f34a08-m0hK45_fw658',
    'https://misc.aotu.io/ONE-SUNDAY/SteamEngine.png',
];
let SliderPanel = class SliderPanel extends doric.Panel {
    build(rootView) {
        rootView.addChild(doric.vlayout([
            doric.text({
                text: "Gallery",
                layoutConfig: {
                    widthSpec: doric.LayoutSpec.AT_MOST,
                    heightSpec: doric.LayoutSpec.EXACTLY,
                },
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[1],
                textAlignment: doric.gravity().center(),
                height: 50,
            }),
            doric.slider({
                itemCount: 100,
                renderPage: (idx) => {
                    return doric.slideItem(doric.image({
                        imageUrl: imageUrls[idx % imageUrls.length],
                        scaleType: doric.ScaleType.ScaleAspectFit,
                        layoutConfig: doric.layoutConfig().w(doric.LayoutSpec.AT_MOST).h(doric.LayoutSpec.AT_MOST).a(doric.gravity().center()),
                    })).also(it => {
                        let start = idx;
                        it.onClick = () => {
                            it.backgroundColor = (colors[++start % colors.length]);
                        };
                    });
                },
                layoutConfig: {
                    widthSpec: doric.LayoutSpec.AT_MOST,
                    heightSpec: doric.LayoutSpec.WRAP_CONTENT,
                    weight: 1,
                },
            }),
        ]).also(it => {
            it.layoutConfig = {
                widthSpec: doric.LayoutSpec.AT_MOST,
                heightSpec: doric.LayoutSpec.AT_MOST,
            };
        }));
    }
};
SliderPanel = __decorate([
    Entry
], SliderPanel);
//# sourceMappingURL=SliderDemo.js.map
