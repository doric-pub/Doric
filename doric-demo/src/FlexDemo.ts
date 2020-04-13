
import { Group, Panel, text, gravity, Color, LayoutSpec, vlayout, hlayout, scroller, IVLayout, IHLayout, layoutConfig, stack, Gravity, flexlayout, image, ScaleType } from "doric";
import { FlexDirection, Wrap, Justify, Align, FlexTypedValue, OverFlow } from "doric/lib/src/util/flexbox";
import { icon_refresh } from "./utils";

@Entry
class LayoutDemo extends Panel {
    build(root: Group) {
        scroller(
            flexlayout(
                [
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        flexConfig: {
                            marginRight: 10,
                        },
                        height: 16,
                    }),
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        flexConfig: {
                            alignSelf: Align.CENTER,

                        },
                        height: 16,
                    }),
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        height: 50,
                    }),
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        height: 16,
                    }),
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        flexConfig: {
                            marginTop: 20,
                            alignContent: Align.CENTER,
                        },
                        height: 16,
                    }),
                ],
                {
                    flexConfig: {
                        flexDirection: FlexDirection.ROW,
                        width: 200,
                        height: 100,
                        flexWrap: Wrap.WRAP,
                        alignContent: Align.CENTER,
                    },
                    backgroundColor: Color.GRAY.alpha(0.1),
                }
            ),
            {
                layoutConfig: layoutConfig().most()
            }
        ).in(root)

        // image({
        //     imageBase64: ICON_GENDER_MAN,
        //     backgroundColor: Color.GRAY,
        //     layoutConfig: {
        //         widthSpec: LayoutSpec.FIT,
        //         heightSpec: LayoutSpec.JUST,
        //         alignment: Gravity.Center,
        //     },
        //     height: 30,
        // }).in(root)
    }
}