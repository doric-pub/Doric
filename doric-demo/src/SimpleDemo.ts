import { Group, Panel, text, gravity, Color, LayoutSpec, vlayout, hlayout, scroller, layoutConfig, stack, Gravity } from "doric";

@Entry
class LayoutDemo extends Panel {
    build(rootView: Group) {
        hlayout([
            vlayout([
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.RED,
                    layoutConfig: layoutConfig().just()
                }),
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.GREEN,
                    layoutConfig: layoutConfig().just()
                }),
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.BLUE,
                    layoutConfig: layoutConfig().just()
                })
            ], {
                width: 100,
                height: 300,
                layoutConfig: layoutConfig().just()
            }),
            vlayout([
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.GREEN,
                    layoutConfig: layoutConfig().just()
                }),
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.BLUE,
                    layoutConfig: layoutConfig().just()
                }),
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.RED,
                    layoutConfig: layoutConfig().just()
                })
            ], {
                width: 100,
                height: 300,
                layoutConfig: layoutConfig().just()
            }),
            vlayout([
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.BLUE,
                    layoutConfig: layoutConfig().just()
                }),
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.RED,
                    layoutConfig: layoutConfig().just()
                }),
                stack([], {
                    width: 100,
                    height: 100,
                    backgroundColor: Color.GREEN,
                    layoutConfig: layoutConfig().just()
                })
            ], {
                width: 100,
                height: 300,
                layoutConfig: layoutConfig().just()
            })
        ], {
            width: 400,
            height: 300,
            layoutConfig: layoutConfig().just(),
            backgroundColor: Color.BLACK
        }).in(rootView)
    }
}