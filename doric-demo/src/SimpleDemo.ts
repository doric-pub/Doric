import { Group, Panel, text, gravity, Color, LayoutSpec, vlayout, hlayout, scroller, layoutConfig } from "doric";
import { colors } from "./utils";

@Entry
class LayoutDemo extends Panel {
    build(rootView: Group) {
        scroller(
            vlayout(
                [
                    text({
                        text: "五子棋",
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
                        textSize: 30,
                        textColor: Color.WHITE,
                        backgroundColor: colors[0],
                        textAlignment: gravity().center(),
                        height: 50,
                    }),
                    hlayout(
                    [
                        text({
                            text: "当前:",
                            textSize: 20,
                            textColor: Color.WHITE,
                            layoutConfig: layoutConfig().just().configWeight(1),
                            height: 50,
                            backgroundColor: colors[1],
                        }),
                        text({
                            text: "获胜方:",
                            textSize: 20,
                            textColor: Color.WHITE,
                            layoutConfig: layoutConfig().just().configWeight(1),
                            height: 50,
                            backgroundColor: colors[2],
                        }),
                    ],
                    {
                        layoutConfig: layoutConfig().fit().configWidth(LayoutSpec.MOST),
                    }),
            ], {
                layoutConfig: layoutConfig().most(),
                backgroundColor: Color.parse('#ecf0f1'),
            })
        ).in(rootView)
    }
}