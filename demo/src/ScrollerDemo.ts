import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, scroller, layoutConfig } from "doric";
import { label } from "./utils";

@Entry
class ScrollerPanel extends Panel {
    build(rootView: Group): void {
        scroller(
            vlayout([
                scroller(
                    vlayout(new Array(100).fill(1).map(e => label('Scroll Content')))
                ).apply({
                    layoutConfig: layoutConfig().exactly(),
                    width: 300,
                    height: 500,
                    bgColor: Color.RED,
                }),
                scroller(
                    vlayout(new Array(100).fill(1).map(e => label('Scroll Content')))
                ).apply({
                    layoutConfig: layoutConfig().exactly(),
                    width: 300,
                    height: 500,
                    bgColor: Color.BLUE,
                })
            ])
        )
            .apply({
                layoutConfig: layoutConfig().atmost().h(LayoutSpec.EXACTLY),
                height: 500,
                bgColor: Color.YELLOW,
            })
            .in(rootView)
    }
}