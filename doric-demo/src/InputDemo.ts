import { Panel, Group, scroller, vlayout, layoutConfig, LayoutSpec, Input, Gravity, log, Color, input, text } from "doric";
import { title, colors } from "./utils";


function getInput(c: Partial<Input>) {
    const inputView = input(c)
    const isFocused = text({
        layoutConfig: {
            widthSpec: LayoutSpec.MOST,
            heightSpec: LayoutSpec.JUST,
        },
        height: 50,
    })
    const inputed = text({
        layoutConfig: {
            widthSpec: LayoutSpec.MOST,
            heightSpec: LayoutSpec.JUST,
        },
        height: 50,
    })
    inputView.onFocusChange = (onFocusChange) => {
        isFocused.text = onFocusChange ? `Focused` : `Unfocused`
    }
    inputView.onTextChange = (text) => {
        inputed.text = `Inputed:${text}`
    }
    return [inputView, isFocused, inputed]
}


@Entry
class InputDemo extends Panel {
    build(root: Group) {
        var [inputView, ...otherView] = getInput({
            layoutConfig: {
                widthSpec: LayoutSpec.FIT,
                heightSpec: LayoutSpec.FIT,
            },
            hintText: "Please input something in one line",
            border: {
                width: 1,
                color: Color.GRAY,
            },
            multiline: false,
            textSize: 20,
            maxLength: 20,
            padding: { top: 10, bottom: 11 }
        });
        scroller(
            vlayout(
                [

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
                ],
                {
                    space: 10,
                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.MOST),
                    onClick: () => { 
                        (inputView as Input).releaseFocus(context);
                    }
                }
            ),
            {
                layoutConfig: layoutConfig().most()
            }
        ).in(root)
    }

}
