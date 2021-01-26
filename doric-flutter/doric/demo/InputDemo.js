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
function getInput(c) {
    const inputView = doric.input(c);
    const isFocused = doric.text({
        layoutConfig: {
            widthSpec: doric.LayoutSpec.MOST,
            heightSpec: doric.LayoutSpec.JUST,
        },
        height: 50,
    });
    const inputed = doric.text({
        layoutConfig: {
            widthSpec: doric.LayoutSpec.MOST,
            heightSpec: doric.LayoutSpec.JUST,
        },
        height: 50,
    });
    inputView.onFocusChange = (onFocusChange) => {
        isFocused.text = onFocusChange ? `Focused` : `Unfocused`;
    };
    inputView.onTextChange = (text) => {
        inputed.text = `Inputed:${text}`;
    };
    return [inputView, isFocused, inputed];
}
let InputDemo = class InputDemo extends doric.Panel {
    build(root) {
        var [inputView, ...otherView] = getInput({
            layoutConfig: {
                widthSpec: doric.LayoutSpec.FIT,
                heightSpec: doric.LayoutSpec.FIT,
            },
            hintText: "Please input something in one line",
            border: {
                width: 1,
                color: doric.Color.GRAY,
            },
            multiline: false,
            textSize: 20,
            maxLength: 20,
            padding: { top: 10, bottom: 11 },
            inputType: doric.InputType.Decimal
        });
        doric.scroller(doric.vlayout([
            title("Demo"),
            // ...getInput({
            //     layoutConfig: {
            //         widthSpec: LayoutSpec.JUST,
            //         heightSpec: LayoutSpec.FIT,
            //     },
            //     width: 300,
            //     hintText: "Please input something",
            //     border: {
            //         width: 1,
            //         color: Color.GRAY,
            //     },
            //     textSize: 40,
            //     maxLength: 20,
            // }),
            inputView,
            ...otherView,
        ], {
            backgroundColor:colors[2],
            space: 10,
            layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.MOST),
            onClick: () => {
                inputView.releaseFocus(context);
            }
        }), {
            layoutConfig: doric.layoutConfig().most()
        }).in(root);
    }
};
InputDemo = __decorate([
    Entry
], InputDemo);
//# sourceMappingURL=InputDemo.js.map
