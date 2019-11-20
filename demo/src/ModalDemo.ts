import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text, scroller, layoutConfig, image, IView, IVLayout, ScaleType, IText, modal } from "doric";
import { colors, label } from "./utils";

@Entry
class ModalDemo extends Panel {
    build(rootView: Group): void {
        scroller(vlayout([
            text({
                text: "Modal",
                layoutConfig: layoutConfig().w(LayoutSpec.AT_MOST),
                textSize: 30,
                textColor: Color.WHITE,
                bgColor: colors[1],
                textAlignment: Gravity.Center,
                height: 50,
            }),
            label('toast'),
            label('Click me').apply({
                width: 200,
                height: 50,
                bgColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
                onClick: () => {
                    modal(context).toast('This is a toast.')
                }
            } as IText),
        ]).apply({
            layoutConfig: layoutConfig().atmost().h(LayoutSpec.WRAP_CONTENT),
            gravity: Gravity.Center,
            space: 10,
        } as IVLayout)).apply({
            layoutConfig: layoutConfig().atmost(),
        }).in(rootView)
    }
}