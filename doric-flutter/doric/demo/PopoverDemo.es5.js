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
function label(str) {
    return doric.text({
        text: str,
        textSize: 16,
    });
}
function title(str) {
    return doric.text({
        text: str,
        layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
        textSize: 30,
        textColor: doric.Color.WHITE,
        backgroundColor: colors[1],
        textAlignment: doric.gravity().center(),
        height: 50,
    });
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PopoverDemo = /*@__PURE__*/(function (Panel) {
    function PopoverDemo () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) PopoverDemo.__proto__ = Panel;
    PopoverDemo.prototype = Object.create( Panel && Panel.prototype );
    PopoverDemo.prototype.constructor = PopoverDemo;

    PopoverDemo.prototype.build = function build (rootView) {
        doric.scroller(doric.vlayout([
            title("Popover Demo"),
            label('Popover').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.popover(context).show(doric.text({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textColor: doric.Color.WHITE,
                        layoutConfig: doric.layoutConfig().just().configAlignment(doric.Gravity.Center),
                        text: "This is PopOver Window",
                    }).also(function (v) {
                        var idx = 0;
                        v.onClick = function () {
                            v.backgroundColor = colors[(++idx) % colors.length];
                        };
                        doric.modal(context).toast('Dismissed after 3 seconds');
                        setTimeout(function () {
                            doric.popover(context).dismiss();
                        }, 3000);
                    }));
                }
            }) ]).apply({
            layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT),
            gravity: doric.gravity().center(),
            space: 10,
        })).apply({
            layoutConfig: doric.layoutConfig().most(),
        }).in(rootView);
    };

    return PopoverDemo;
}(doric.Panel));
PopoverDemo = __decorate([
    Entry
], PopoverDemo);
//# sourceMappingURL=PopoverDemo.es5.js.map
