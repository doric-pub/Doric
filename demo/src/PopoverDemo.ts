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
                bgColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
                onClick: () => {
                    popover(context).show(text({
                        width: 200,
                        height: 50,
                        bgColor: colors[0],
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().exactly().a(Gravity.Center),
                        text: "This is PopOver Window",
                        onClick: () => {
                            modal(context).toast('Dismissed after 3 seconds')
                            setTimeout(() => {
                                popover(context).dismiss()
                            }, 3000)
                        },
                    }).also(v => {
                        let idx = 0
                        v.onClick = () => {
                            v.bgColor = colors[(++idx) % colors.length]
                        }
                    }))
                }
            } as IText),
        ]).apply({
            layoutConfig: layoutConfig().atmost().h(LayoutSpec.WRAP_CONTENT),
            gravity: gravity().center(),
            space: 10,
        } as IVLayout)).apply({
            layoutConfig: layoutConfig().atmost(),
        }).in(rootView)
    }
}