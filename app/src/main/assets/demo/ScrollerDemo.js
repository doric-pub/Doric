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
function label(str) {
    return doric.text({
        text: str,
        textSize: 16,
    });
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let ScrollerPanel = class ScrollerPanel extends doric.Panel {
    build(rootView) {
        doric.scroller(doric.vlayout([
            doric.scroller(doric.vlayout(new Array(100).fill(1).map(e => label('Scroll Content')))).apply({
                layoutConfig: doric.layoutConfig().exactly(),
                width: 300,
                height: 500,
                backgroundColor: doric.Color.RED,
            }),
            doric.scroller(doric.vlayout(new Array(100).fill(1).map(e => label('Scroll Content')))).apply({
                layoutConfig: doric.layoutConfig().exactly(),
                width: 300,
                height: 500,
                backgroundColor: doric.Color.BLUE,
            })
        ]))
            .apply({
            layoutConfig: doric.layoutConfig().atmost().h(doric.LayoutSpec.EXACTLY),
            height: 500,
            backgroundColor: doric.Color.YELLOW,
        })
            .in(rootView);
    }
};
ScrollerPanel = __decorate([
    Entry
], ScrollerPanel);
//# sourceMappingURL=ScrollerDemo.js.map
