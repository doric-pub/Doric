import { Group, Panel, popover, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text, scroller, layoutConfig, image, IView, IVLayout, ScaleType, modal, IText, network } from "doric";
import { title, label, colors } from "./utils";

@Entry
class PopoverDemo extends Panel {
    build(rootView: Group): void {
        scroller(vlayout([
            title("Popover Demo"),
            label('Popover').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    popover(context).show(text({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just().configAlignmnet(Gravity.Center),
                        text: "This is PopOver Window",
                    }).also(v => {
                        let idx = 0
                        v.onClick = () => {
                            v.backgroundColor = colors[(++idx) % colors.length]
                        }
                        modal(context).toast('Dismissed after 3 seconds')
                        setTimeout(() => {
                            popover(context).dismiss()
                        }, 3000)
                    }))
                }
            } as IText),
        ]).apply({
            layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
            gravity: gravity().center(),
            space: 10,
        } as IVLayout)).apply({
            layoutConfig: layoutConfig().most(),
        }).in(rootView)
    }
}