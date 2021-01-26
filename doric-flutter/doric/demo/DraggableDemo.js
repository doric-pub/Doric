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
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let DraggableDemo = class DraggableDemo extends doric.Panel {
    build(root) {
        let textView;
        let drag = doric.draggable(textView = doric.text({
            layoutConfig: doric.layoutConfig().just().configAlignment(doric.Gravity.Center),
            width: 100,
            height: 30,
            text:"draggable txt",
            onClick: () => {
                doric.modal(context).toast('Clicked');
            }
        }), {
            onDrag: (x, y) => {
                textView.text = "x: " + x.toFixed(0) + " y: " + y.toFixed(0);
            },
            layoutConfig: doric.layoutConfig().just(),
            width: 100,
            height: 100,
            backgroundColor: doric.Color.WHITE
        });
        doric.vlayout([
            title("Draggable Demo"),
            doric.stack([
                drag,
            ], {
                layoutConfig: doric.layoutConfig().most()
            })
        ], {
            layoutConfig: doric.layoutConfig().most(),
            backgroundColor: doric.Color.BLACK
        })
            .in(root);
    }
};
DraggableDemo = __decorate([
    Entry
], DraggableDemo);
//# sourceMappingURL=DraggableDemo.js.map
