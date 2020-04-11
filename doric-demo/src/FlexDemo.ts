
import { Group, Panel, text, gravity, Color, LayoutSpec, vlayout, hlayout, scroller, IVLayout, IHLayout, layoutConfig, stack, Gravity, flexlayout } from "doric";
import { FlexDirection, Wrap, Justify, Align, FlexTypedValue, OverFlow } from "doric/lib/src/util/flexbox";
import { colors } from "./utils";

@Entry
class LayoutDemo extends Panel {
    build(root: Group) {
        stack(
            [
                scroller(
                    flexlayout(
                        [
                            stack([],
                                {
                                    backgroundColor: colors[1],
                                    flexConfig: {
                                        width: 500,
                                        height: 100,
                                    }
                                }),
                            stack([],
                                {
                                    backgroundColor: colors[2],
                                    flexConfig: {
                                        width: 100,
                                        height: 100,
                                    }
                                }),
                        ],
                        {
                            flexConfig: {
                                flexDirection: FlexDirection.COLUMN,
                            },
                            backgroundColor: colors[4].alpha(0.1)
                        }),
                    {
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.FIT,
                            minHeight: 200,
                            maxHeight: 400,
                            maxWidth: 300,
                        },
                        backgroundColor: colors[0].alpha(0.3),
                    })
            ],
            {
                layoutConfig: layoutConfig().fit(),
            }
        ).in(root)
        // flexScroller(
        //     [
        //         stack([],
        //             {
        //                 backgroundColor: colors[1],
        //                 flexConfig: {
        //                     width: 500,
        //                     height: 100,
        //                 }
        //             }),
        //         stack([],
        //             {
        //                 backgroundColor: colors[2],
        //                 flexConfig: {
        //                     width: 100,
        //                     height: 300,
        //                 }
        //             }),
        //         stack([],
        //             {
        //                 backgroundColor: colors[3],
        //                 flexConfig: {
        //                     width: 100,
        //                     height: 100,
        //                 }
        //             }),
        //     ],
        //     {
        //         backgroundColor: Color.GRAY.alpha(0.3),
        //         layoutConfig: layoutConfig().fit(),
        //         flexConfig: {
        //             maxWidth: 300,
        //             maxHeight: 300,
        //         },
        //     })//.in(root)
    }
}