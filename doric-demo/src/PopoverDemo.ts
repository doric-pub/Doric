import { Group, Panel, popover, text, gravity, Color, LayoutSpec, vlayout, Gravity, scroller, layoutConfig, modal, } from "doric";
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
                        layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
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
            }),
        ]).apply({
            layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
            gravity: gravity().center(),
            space: 10,
        })).apply({
            layoutConfig: layoutConfig().most(),
        }).in(rootView)
    }
}