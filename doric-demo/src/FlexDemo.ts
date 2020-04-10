
import { Group, Panel, text, gravity, Color, LayoutSpec, vlayout, hlayout, scroller, IVLayout, IHLayout, layoutConfig, stack, Gravity, flexlayout } from "doric";
import { FlexDirection, Wrap, Justify, Align, FlexTypedValue } from "doric/lib/src/util/flexbox";

const colors = [
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
]

function box(idx = 0) {
    return stack([], {
        flexConfig: {
            width: 20,
            height: 20,
        },
        backgroundColor: Color.parse(colors[idx || 0])
    })
}

function boxStr(str: string, idx = 0) {
    return text({
        width: 20,
        height: 20,
        text: str,
        textColor: Color.WHITE,
        layoutConfig: layoutConfig().just(),
        backgroundColor: Color.parse(colors[idx || 0])
    })
}

function label(str: string) {
    return text({
        text: str,
        textSize: 16,
    })
}

@Entry
class LayoutDemo extends Panel {
    build(root: Group) {
        flexlayout(
            [
                box(0),
                box(1),
                box(2),
                box(3),
                box(4),
                box(0),
                box(1),
                box(2),
                box(3),
                box(4),
                box(0),
                box(1),
                box(2),
                box(3),
                box(4),
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