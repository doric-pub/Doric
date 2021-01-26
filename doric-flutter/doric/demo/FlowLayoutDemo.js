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
let FlowDemo = class FlowDemo extends doric.Panel {
    build(rootView) {
        const flowView = doric.flowlayout({
            layoutConfig: doric.layoutConfig().most(),
            itemCount: 100,
            columnCount: 3,
            columnSpace: 10,
            rowSpace: 10,
            renderItem: (idx) => {
                return doric.flowItem(doric.text({
                    text: `${idx}`,
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
            onLoadMore: () => {
                setTimeout(() => {
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
    }
};
FlowDemo = __decorate([
    Entry
], FlowDemo);
//# sourceMappingURL=FlowLayoutDemo.js.map
