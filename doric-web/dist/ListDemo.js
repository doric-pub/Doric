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
let ListPanel = class ListPanel extends doric.Panel {
    build(rootView) {
        let offset = Math.ceil(Math.random() * colors.length);
        doric.vlayout([
            doric.list({
                itemCount: 100,
                renderItem: (idx) => {
                    let counter;
                    return doric.listItem(doric.hlayout([
                        doric.text({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.FIT,
                                heightSpec: doric.LayoutSpec.JUST,
                                alignment: doric.gravity().center(),
                            },
                            text: `Cell At Line ${idx}`,
                            textAlignment: doric.gravity().center(),
                            textColor: doric.Color.parse("#ffffff"),
                            textSize: 20,
                            height: 50,
                        }),
                        doric.text({
                            textColor: doric.Color.parse("#ffffff"),
                            textSize: 20,
                            text: "",
                        }).also(it => {
                            counter = it;
                            it.layoutConfig = {
                                widthSpec: doric.LayoutSpec.FIT,
                                heightSpec: doric.LayoutSpec.FIT,
                                margin: {
                                    left: 10,
                                }
                            };
                        })
                    ]).also(it => {
                        it.layoutConfig = {
                            widthSpec: doric.LayoutSpec.MOST,
                            heightSpec: doric.LayoutSpec.FIT,
                            margin: {
                                bottom: 2,
                            }
                        };
                        it.gravity = doric.gravity().center();
                        it.backgroundColor = colors[(idx + offset) % colors.length];
                        let clicked = 0;
                        it.onClick = () => {
                            counter.text = `Item Clicked ${++clicked}`;
                        };
                    })).also(it => {
                        it.layoutConfig = {
                            widthSpec: doric.LayoutSpec.MOST,
                            heightSpec: doric.LayoutSpec.FIT,
                        };
                        it.onClick = () => {
                            doric.log(`Click item at ${idx}`);
                            it.height += 10;
                            it.nativeChannel(context, "getWidth")().then(resolve => {
                                doric.log(`resolve,${resolve}`);
                            }, reject => {
                                doric.log(`reject,${reject}`);
                            });
                        };
                    });
                },
                layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.JUST),
                height: 500,
            }).also(it => {
                it.loadMore = true;
                it.onLoadMore = () => {
                    it.itemCount += 100;
                };
                it.loadMoreView = doric.listItem(doric.text({
                    text: "Loading",
                    layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.JUST).configAlignmnet(doric.Gravity.Center),
                    height: 50,
                }));
            }),
        ]).apply({
            layoutConfig: doric.layoutConfig().most(),
        }).in(rootView);
    }
};
ListPanel = __decorate([
    Entry
], ListPanel);
//# sourceMappingURL=ListDemo.js.map
