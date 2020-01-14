import { Group, Panel, gravity, Color, LayoutSpec, vlayout, scroller, layoutConfig, IVLayout, IText, statusbar, StatusBarMode } from "doric";
import { title, label, colors } from "./utils";

@Entry
class StatusBarDemo extends Panel {
    build(rootView: Group): void {
        scroller(vlayout([
            title("StatusBar Demo"),
            label('show').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    statusbar(context).setHidden(false)
                }
            } as IText),
            label('hide').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    statusbar(context).setHidden(true)
                }
            } as IText),
            label('light').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just().configMargin({top: 30}),
                onClick: () => {
                    statusbar(context).setMode(StatusBarMode.LIGHT)
                }
            } as IText),
            label('dark').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    statusbar(context).setMode(StatusBarMode.DARK)
                }
            } as IText),
            label('white').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just().configMargin({top: 30}),
                onClick: () => {
                    statusbar(context).setColor(Color.parse("#ffffff"))
                }
            } as IText),
            label('black').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    statusbar(context).setColor(Color.parse("#000000"))
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