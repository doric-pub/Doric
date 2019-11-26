import { refreshable, Group, Panel, navbar, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text, scroller, layoutConfig, image, IView, IVLayout, ScaleType, modal, IText, network, navigator } from "doric";
import { title, label, colors } from "./utils";

@Entry
class RefreshableDemo extends Panel {
    build(rootView: Group): void {
        let refreshView = refreshable({
            layoutConfig: layoutConfig().atmost(),
            header: text({
                text: "This is Header",
                width: 100,
                height: 100,
                layoutConfig: layoutConfig().exactly(),
            }),
            content: scroller(vlayout([
                title("Refreshable Demo"),
                label('start Refresh').apply({
                    width: 300,
                    height: 50,
                    bgColor: colors[0],
                    textSize: 30,
                    textColor: Color.WHITE,
                    layoutConfig: layoutConfig().exactly(),
                    onClick: () => {
                        refreshView.setRefreshing(context, true)
                    }
                } as IText),
                label('stop Refresh').apply({
                    width: 300,
                    height: 50,
                    bgColor: colors[0],
                    textSize: 30,
                    textColor: Color.WHITE,
                    layoutConfig: layoutConfig().exactly(),
                    onClick: () => {
                        refreshView.setRefreshing(context, false)
                    }
                } as IText),

                label('Enable Refresh').apply({
                    width: 300,
                    height: 50,
                    bgColor: colors[0],
                    textSize: 30,
                    textColor: Color.WHITE,
                    layoutConfig: layoutConfig().exactly(),
                    onClick: () => {
                        refreshView.setRefreshable(context, true)
                    }
                } as IText),

                label('Disable Refresh').apply({
                    width: 300,
                    height: 50,
                    bgColor: colors[0],
                    textSize: 30,
                    textColor: Color.WHITE,
                    layoutConfig: layoutConfig().exactly(),
                    onClick: () => {
                        refreshView.setRefreshable(context, false)
                    }
                } as IText),
                label('Rotate self').apply({
                    width: 300,
                    height: 50,
                    bgColor: colors[0],
                    textSize: 30,
                    textColor: Color.WHITE,
                    layoutConfig: layoutConfig().exactly(),
                } as IText).also(v => {
                    v.onClick = () => {
                        v.nativeChannel(context, "setRotation")(0.25)
                    }
                }),
            ]).apply({
                layoutConfig: layoutConfig().atmost().h(LayoutSpec.WRAP_CONTENT),
                gravity: gravity().center(),
                space: 10,
            } as IVLayout)).apply({
                layoutConfig: layoutConfig().atmost(),
            })
        }).in(rootView)
    }
}