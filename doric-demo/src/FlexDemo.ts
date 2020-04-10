
import { Group, Panel, text, gravity, Color, LayoutSpec, vlayout, hlayout, scroller, IVLayout, IHLayout, layoutConfig, stack, Gravity, flexlayout } from "doric";
import { FlexDirection, Wrap, Justify, Align, FlexTypedValue } from "doric/lib/src/util/flexbox";
import { colors } from "./utils";

@Entry
class LayoutDemo extends Panel {
    build(root: Group) {
        flexlayout(
            [
                stack([], {
                    flexConfig: {
                        width: 100,
                        height: 100,
                    },
                    backgroundColor: colors[0]
                }),
                stack([], {
                    flexConfig: {
                        width: 100,
                        height: 100,
                    },
                    backgroundColor: colors[1],
                }),
                stack([], {
                    flexConfig: {
                        width: 100,
                        height: 100,
                    },
                    backgroundColor: colors[2],
                }),
            ],
            {
                layoutConfig: layoutConfig().fit(),
                backgroundColor: Color.GRAY,
                flexConfig: {
                    flexDirection: FlexDirection.COLUMN,
                    justifyContent: Justify.SPACE_EVENLY,
                    alignContent: Align.CENTER,
                    flexWrap: Wrap.WRAP,
                    width: FlexTypedValue.Auto,
                    height: FlexTypedValue.Auto,
                }
            }
        )
            .in(root)
    }
}