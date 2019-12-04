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
        doric.flowlayout({
            layoutConfig: doric.layoutConfig().atmost(),
            itemCount: 500,
            columnCount: 3,
            columnSpace: 10,
            rowSpace: 10,
            renderItem: (idx) => {
                return new doric.FlowLayoutItem().apply({
                    backgroundColor: colors[idx % colors.length],
                    height: 50 + (idx % 3) * 20,
                    layoutConfig: doric.layoutConfig().w(doric.LayoutSpec.AT_MOST),
                }).also(it => {
                    it.addChild(doric.text({
                        text: `${idx}`,
                        textColor: doric.Color.WHITE,
                        textSize: 20,
                        layoutConfig: doric.layoutConfig().wrap().a(doric.Gravity.Center)
                    }));
                });
            },
        })
            .in(rootView);
    }
};
FlowDemo = __decorate([
    Entry
], FlowDemo);
//# sourceMappingURL=FlowLayoutDemo.js.map
