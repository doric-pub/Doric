import { refreshable, Group, Panel, pullable, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text, scroller, layoutConfig, image, IView, IVLayout, ScaleType, modal, IText, network, navigator, stack, Image } from "doric";
import { title, label, colors, icon_refresh } from "./utils";

@Entry
class RefreshableDemo extends Panel {
    build(rootView: Group): void {
        let refreshImage: Image
        let refreshView = refreshable({
            layoutConfig: layoutConfig().atmost(),
            onRefresh: () => {
                log('onRefresh')
                setTimeout(() => {
                    refreshView.setRefreshing(context, false)
                }, 5000)
            },
            header: pullable(context,
                stack([
                    image({
                        layoutConfig: layoutConfig().exactly().m({ top: 50, bottom: 10, }),
                        width: 30,
                        height: 30,
                        imageBase64: icon_refresh,
                    }).also(v => {
                        refreshImage = v
                    }),
                ]),
                {
                    startAnimation: () => {
                        log('startAnimation')
                    },
                    stopAnimation: () => {
                        log('stopAnimation')
                    },
                    setProgressRotation: (rotation: number) => {
                        refreshImage.setRotation(context, rotation)
                    },
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
        }).apply({
            bgColor: Color.YELLOW
        }).in(rootView)
    }
}