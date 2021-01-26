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
let StickDemo = class StickDemo extends doric.Panel {
    build(root) {
        this.indicator = new doric.Stack;
        this.indicator.backgroundColor = colors[0];
        this.indicator.width = 20;
        this.indicator.height = 2;
        doric.scroller(doric.vlayout([
            doric.stack([
                doric.image({
                    layoutConfig: doric.layoutConfig().most(),
                    imageUrl: "https://p.upyun.com/demo/webp/webp/jpg-0.webp",
                    scaleType: doric.ScaleType.ScaleAspectFill,
                }),
            ]).apply({
                layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.JUST),
                height: 200,
                backgroundColor: colors[0],
            }),
            doric.stack([
                doric.hlayout([
                    ...this.tabs = [0, 1, 2].map(idx => {
                        return doric.text({
                            text: `Tab  ${idx}`,
                            layoutConfig: doric.layoutConfig().just().configWeight(1),
                            height: 41,
                            onClick: () => {
                                this.sliderView.slidePage(context, idx, true);
                            },
                        });
                    })
                ]).apply({
                    layoutConfig: doric.layoutConfig().most(),
                    gravity: doric.Gravity.Center,
                }),
                this.indicator,
            ]).apply({
                layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.JUST),
                height: 57,
            }),
            (new doric.NestedSlider).also(v => {
                this.sliderView = v;
                v.onPageSlided = (idx) => {
                    this.refreshTabs(idx);
                };
                [0, 1, 2].map(idx => {
                    return doric.flowlayout({
                        layoutConfig: doric.layoutConfig().just(),
                        width: root.width,
                        height: root.height - 57,
                        itemCount: 100,
                        columnCount: 2,
                        columnSpace: 10,
                        rowSpace: 10,
                        renderItem: (itemIdx) => {
                            return new doric.FlowLayoutItem().apply({
                                backgroundColor: colors[itemIdx % colors.length],
                                height: 50,
                                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                            }).also(it => {
                                it.addChild(doric.text({
                                    text: `In Page ${idx},${itemIdx}`,
                                    textColor: doric.Color.WHITE,
                                    textSize: 20,
                                    layoutConfig: doric.layoutConfig().fit().configAlignment(doric.Gravity.Center)
                                }).also(v => {
                                    v.onClick = () => {
                                        v.text = "Clicked";
                                    };
                                }));
                            });
                        },
                    });
                }).forEach(e => {
                    v.addSlideItem(e);
                });
            }).apply({
                layoutConfig: doric.layoutConfig().just(),
                width: root.width,
                height: root.height - 57,
            }),
        ])
            .also(it => {
            it.layoutConfig = doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT);
        }))
            .apply({
            layoutConfig: doric.layoutConfig().most()
        })
            .in(root);
        this.indicator.centerX = this.getRootView().width / this.tabs.length / 2;
        this.refreshTabs(0);
    }
    refreshTabs(page) {
        this.tabs.forEach((e, idx) => {
            if (idx == page) {
                e.textColor = colors[0];
            }
            else {
                e.textColor = doric.Color.BLACK;
            }
        });
        this.indicator.layoutConfig = doric.layoutConfig().just().configAlignment(doric.Gravity.Bottom).configMargin({ bottom: 13 });
        doric.animate(context)({
            animations: () => {
                this.indicator.centerX = this.getRootView().width / this.tabs.length * (page + 0.5);
            },
            duration: 300,
        });
    }
};
StickDemo = __decorate([
    Entry
], StickDemo);
//# sourceMappingURL=StickDemo.js.map
