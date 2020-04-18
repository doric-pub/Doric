import { refreshable, Group, Panel, pullable, gravity, Color, LayoutSpec, log, vlayout, Image, layoutConfig, stack, image } from "doric";
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
                }),
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
                }),

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
                }),

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
                }),
            ]).apply({
                layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                gravity: gravity().centerX(),
                space: 10,
            }))
        }).apply({
            backgroundColor: Color.YELLOW
        }).in(rootView)
    }
}