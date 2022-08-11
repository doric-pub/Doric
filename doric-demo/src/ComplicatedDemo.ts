import { Panel, Group, vlayout, image, layoutConfig, ScaleType, refreshable, Color, pullable, stack, Image, Refreshable, TranslationAnimation, loge, log, list, listItem, text } from "doric";
import { title, icon_refresh, colors } from "./utils";

@Entry
class MyDemo extends Panel {
    build(root: Group) {
        let refreshed: Refreshable
        let headerImage: Image
        stack(
            [
                refreshed = refreshable({
                    onRefresh: () => {
                        refreshed.setRefreshing(context, false)
                    },
                    header: pullable(
                        stack([]).apply({
                            backgroundColor: Color.RED,
                            layoutConfig: layoutConfig().just(),
                            width: 100,
                            height: 30,
                        }),
                        {
                            startAnimation: () => {
                            },
                            stopAnimation: () => {
                            },
                            setPullingDistance: (distance: number) => {
                                headerImage.scaleX = headerImage.scaleY = (headerImage.height + distance * 2) / headerImage.height
                            },
                        }),
                    content: list({
                        itemCount: 20,
                        renderItem: (idx) => {
                            return listItem(text({
                                text: `Item :${idx}`,
                                layoutConfig: layoutConfig().just(),
                                width: root.width,
                                height: 50,
                                textColor: Color.WHITE,
                                backgroundColor: colors[idx % colors.length],
                            }))
                        },
                        layoutConfig: layoutConfig().most(),
                    }),
                    layoutConfig: layoutConfig().most(),
                }).also(v => {
                    v.top = 200
                }),

                headerImage = image({
                    imageUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.jj20.com%2Fup%2Fallimg%2F1112%2F12101P11147%2F1Q210011147-3.jpg&refer=http%3A%2F%2Fpic.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662787633&t=99942c90360f55bbcfe00fa140d1c1df",
                    layoutConfig: layoutConfig().just(),
                    width: root.width,
                    height: 200,
                    scaleType: ScaleType.ScaleAspectFill,
                }),
            ],
            {
                layoutConfig: layoutConfig().most()
            }
        ).in(root)
    }
}