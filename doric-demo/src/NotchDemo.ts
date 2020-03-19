import { Group, Panel, gravity, Color, LayoutSpec, vlayout, scroller, layoutConfig, IVLayout, IText, notch, modal, Gravity } from "doric";
import { title, label, colors } from "./utils";

@Entry
class NotchDemo extends Panel {
    build(rootView: Group): void {
        scroller(vlayout([
            title("Notch Demo"),
            label('area').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    notch(context).inset()
                    .then((inset) => {
                        modal(context).toast("top: " + inset.top + "\n" + "left: " + inset.left + "\n" + "bottom: " + inset.bottom + "\n" + "right: " + inset.right, Gravity.Bottom)
                    })
                    .catch(() => {

                    })
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