import { Group, Panel, text, gravity, Color, LayoutSpec, vlayout, hlayout, scroller, layoutConfig, stack, Gravity } from "doric";

@Entry
class LayoutDemo extends Panel {
    build(rootView: Group) {
        hlayout([
            vlayout([
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
                width: 100,
                height: 300,
            }),
            vlayout([
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.GREEN
                }),
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.BLUE
                }),
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.RED
                })
            ], {
                width: 100,
                height: 300,
            }),
            vlayout([
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.BLUE
                }),
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.RED
                }),
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.GREEN
                })
            ], {
                width: 100,
                height: 300,
            })
        ], {
            width: 400,
            height: 300,
            backgroundColor: Color.BLACK
        }).in(rootView)
    }
}