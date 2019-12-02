import { Panel, Group, vlayout, image, layoutConfig, ScaleType, refreshable, Color, pullable, stack, Image, Refreshable, TranslationAnimation } from "doric";
import { title, icon_refresh } from "./utils";

@Entry
class MyDemo extends Panel {
    build(root: Group) {
        let refreshed: Refreshable
        let headerImage: Image
        stack([
            refreshed = refreshable({
                onRefresh: () => {
                    refreshed.setRefreshing(context, false)
                },
                header: pullable(context,
                    stack([]).apply({
                        backgroundColor: Color.RED,
                        layoutConfig: layoutConfig().exactly(),
                        width: 100,
                        height: 30,
                    }),
                    {
                        startAnimation: () => {
                        },
                        stopAnimation: () => {
                        },
                        setPullingDistance: (rotation: number) => {
                            headerImage.scaleX = headerImage.scaleY = (headerImage.height + rotation) / headerImage.height
                        },
                    }),
                content: vlayout([]).apply({
                    backgroundColor: Color.YELLOW,
                }),
            }).apply({
                layoutConfig: layoutConfig().atmost(),
            }).also(v => {
                v.top = 200
            }),

            headerImage = image({
                imageUrl: "https://img.zcool.cn/community/01e75b5da933daa801209e1ffa4649.jpg@1280w_1l_2o_100sh.jpg",
                layoutConfig: layoutConfig().exactly(),
                width: root.width,
                height: 200,
                scaleType: ScaleType.ScaleAspectFill,
            }),
        ]).in(root)
    }
}