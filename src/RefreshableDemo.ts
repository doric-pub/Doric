import { refreshable, Group, Panel, pullable, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text, scroller, layoutConfig, image, IView, IVLayout, ScaleType, modal, IText, network, navigator, stack, Image } from "doric";
import { title, label, colors, icon_refresh } from "./utils";

@Entry
class RefreshableDemo extends Panel {
    build(rootView: Group): void {
        let refreshImage: Image
        let refreshView = refreshable({
            layoutConfig: layoutConfig().most(),
            onRefresh: () => {
                log('onRefresh')
                setTimeout(() => {
                    refreshView.setRefreshing(context, false)
                }, 5000)
            },
            header: pullable(
                stack([
                    image({
                        layoutConfig: layoutConfig().just().configMargin({ top: 50, bottom: 10, }),
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
                    setPullingDistance: (distance: number) => {
                        refreshImage.rotation = distance / 30
                    },
                }),
            content: (vlayout([
                title("Refreshable Demo"),
                label('start Refresh').apply({
                    width: 300,
                    height: 50,
                    backgroundColor: colors[0],
                    textSize: 30,
                    textColor: Color.WHITE,
                    layoutConfig: layoutConfig().just(),
                    onClick: () => {
                        refreshView.setRefreshing(context, true)
                    }
                } as IText),
                label('stop Refresh').apply({
                    width: 300,
                    height: 50,
                    backgroundColor: colors[0],
                    textSize: 30,
                    textColor: Color.WHITE,
                    layoutConfig: layoutConfig().just(),
                    onClick: () => {
                        refreshView.setRefreshing(context, false)
                    }
                } as IText),

                label('Enable Refresh').apply({
                    width: 300,
                    height: 50,
                    backgroundColor: colors[0],
                    textSize: 30,
                    textColor: Color.WHITE,
                    layoutConfig: layoutConfig().just(),
                    onClick: () => {
                        refreshView.setRefreshable(context, true)
                    }
                } as IText),

                label('Disable Refresh').apply({
                    width: 300,
                    height: 50,
                    backgroundColor: colors[0],
                    textSize: 30,
                    textColor: Color.WHITE,
                    layoutConfig: layoutConfig().just(),
                    onClick: () => {
                        refreshView.setRefreshable(context, false)
                    }
                } as IText),
            ]).apply({
                layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                gravity: gravity().centerX(),
                space: 10,
            } as IVLayout))
        }).apply({
            backgroundColor: Color.YELLOW
        }).in(rootView)
    }
}