'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let CounterView = class CounterView extends doric.Panel {
    build(root) {
         var theText;
         var index=0;
        doric.stack([
          doric.list({
                             itemCount: 999,
                           renderItem: (index) => {
                                                   var tv;
                                                   return doric.listItem(doric.hlayout([
                                                       tv = doric.text({
                                                           text: "条目" + index
                                                       })
                                                   ], {
                                                       onClick: () => {
                                                           tv.text = "点击了" + index;
                                                       },
                                                       gravity: doric.gravity().center(),
                                                       backgroundColor: doric.Color.RED,
                                                       layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.JUST).configMargin({
                                                           left: 10,
                                                           top: 10,
                                                           right:10
                                                       }),
                                                       height: 100
                                                   }),{
                                                        layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT),
                                                   });
                                               },
                             layoutConfig: {
                                 widthSpec: doric.LayoutSpec.MOST,
                                 heightSpec: doric.LayoutSpec.MOST,
                             },
                         })
        ], {
            layoutConfig: doric.layoutConfig().most(),
        }).in(root);
    }
};
CounterView = __decorate([
    Entry
], CounterView);
//# sourceMappingURL=Counter.js.map
