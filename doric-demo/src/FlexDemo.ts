
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
                                        width: 300,
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
                            stack([],
                                {
                                    backgroundColor: colors[3],
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
                            backgroundColor: colors[4]
                        }),
                    {
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.FIT
                        },
                        backgroundColor: colors[0],
                    })
            ],
            {
                layoutConfig: layoutConfig().just(),
                width: 250,
                height: 250,
            }
        ).in(root)
    }
}