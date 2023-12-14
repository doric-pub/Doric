import { Group, Panel, gravity, Color, LayoutSpec, vlayout, scroller, layoutConfig, notch, modal, Gravity, log } from "doric";
import { title, label, colors } from "./utils";

export class NotchDemo extends Panel {
  build(rootView: Group): void {
    scroller(vlayout([
    title("Notch Demo"),
    label('inset').apply({
      width: 200,
      height: 50,
      backgroundColor: colors[0],
      textSize: 30,
      textColor: Color.WHITE,
      layoutConfig: layoutConfig().just(),
      onClick: () => {
        notch(this.context).inset()
          .then((inset) => {
            let result = "top: " + inset.top + "\n" + "left: " + inset.left + "\n" + "bottom: " + inset.bottom + "\n" + "right: " + inset.right
            modal(this.context).toast(result, Gravity.Bottom)
            log(result)
          })
          .catch(() => {

          })
      }
    }),
    ]).apply({
      layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
      gravity: gravity().center(),
      space: 10,
    })).apply({
      layoutConfig: layoutConfig().most(),
    }).into(rootView)
  }
}