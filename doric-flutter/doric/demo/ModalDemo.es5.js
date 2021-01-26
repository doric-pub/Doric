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

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ModalDemo = /*@__PURE__*/(function (Panel) {
    function ModalDemo () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) ModalDemo.__proto__ = Panel;
    ModalDemo.prototype = Object.create( Panel && Panel.prototype );
    ModalDemo.prototype.constructor = ModalDemo;

    ModalDemo.prototype.build = function build (rootView) {
        doric.scroller(doric.vlayout([
            doric.text({
                text: "Modal",
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[1],
                textAlignment: doric.Gravity.Center,
                height: 50,
            }),
            label('toast on bottom'),
            label('Click me').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.modal(context).toast('This is a toast.');
                }
            }),
            label('toast on top'),
            label('Click me').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.modal(context).toast('This is a toast.', doric.Gravity.Top);
                }
            }),
            label('toast on center'),
            label('Click me').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.modal(context).toast('This is a toast.', doric.Gravity.Center);
                }
            }),
            doric.text({
                text: "Alert",
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[2],
                textAlignment: doric.Gravity.Center,
                height: 50,
            }),
            label('Click me').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.modal(context).alert({
                        msg: 'This is alert.',
                        title: 'Alert title',
                        okLabel: "OkLabel"
                    }).then(function (e) {
                        doric.modal(context).toast('Clicked OK.');
                    });
                }
            }),
            doric.text({
                text: "Confirm",
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[3],
                textAlignment: doric.Gravity.Center,
                height: 50,
            }),
            label('Click me').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.modal(context).confirm({
                        msg: 'This is Confirm.',
                        title: 'Confirm title',
                        okLabel: "OkLabel",
                        cancelLabel: 'CancelLabel',
                    }).then(function () {
                        doric.modal(context).toast('Clicked OK.');
                    }, function () {
                        doric.modal(context).toast('Clicked Cancel.');
                    });
                }
            }),
            doric.text({
                text: "Prompt",
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[4],
                textAlignment: doric.Gravity.Center,
                height: 50,
            }),
            label('Click me').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.modal(context).prompt({
                        msg: 'This is Prompt.',
                        title: 'Prompt title',
                        okLabel: "OkLabel",
                        cancelLabel: 'CancelLabel',
                    }).then(function (e) {
                        doric.modal(context).toast(("Clicked OK.Input:" + e));
                    }, function (e) {
                        doric.modal(context).toast(("Clicked Cancel.Input:" + e));
                    });
                }
            }) ], {
            layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT),
            gravity: doric.Gravity.Center,
            space: 10,
        }), {
            layoutConfig: doric.layoutConfig().most(),
        }).in(rootView);
    };

    return ModalDemo;
}(doric.Panel));
ModalDemo = __decorate([
    Entry
], ModalDemo);
//# sourceMappingURL=ModalDemo.es5.js.map
