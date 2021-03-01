import { Group, Panel, text, gravity, Color, LayoutSpec, vlayout, hlayout, scroller, layoutConfig, stack, Gravity } from "doric";

@Entry
class LayoutDemo extends Panel {
    build(rootView: Group) {
        hlayout([
            stack([], {
                width: 100,
                height: 100,
                backgroundColor: Color.RED
            }),
            stack([], {
                width: 100,
                height: 100,
                backgroundColor: Color.GREEN
            }),
            stack([], {
                width: 100,
                height: 100,
                backgroundColor: Color.BLUE
            })
        ], {
            width: 300,
            height: 300,
            backgroundColor: Color.BLACK
        }).in(rootView)
    }
}