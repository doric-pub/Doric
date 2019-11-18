import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, scroller } from "doric";
const colors = [
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
]
@Entry
class ScrollerPanel extends Panel {
    build(rootView: Group): void {
        rootView.addChild(scroller(vlayout(
            [
                // ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5].map(e => text({
                //     text: colors[e % colors.length],
                //     textColor: Color.parse('#ffffff'),
                //     textSize: 20,
                //     bgColor: Color.parse(colors[e % colors.length]),
                //     layoutConfig: {
                //         widthSpec: LayoutSpec.EXACTLY,
                //         heightSpec: LayoutSpec.EXACTLY,
                //     },
                //     width: 200,
                //     height: 50,
                // })),
                ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5].map(i => hlayout([
                    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5].map(j => text({
                        text: colors[(i + j) % colors.length],
                        textColor: Color.parse('#ffffff'),
                        textSize: 20,
                        bgColor: Color.parse(colors[(i + j) % colors.length]),
                        layoutConfig: {
                            widthSpec: LayoutSpec.EXACTLY,
                            heightSpec: LayoutSpec.EXACTLY,
                        },
                        width: 80,
                        height: 50,
                    })),
                ]
                )),
                hlayout([
                    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5].map(e => text({
                        text: colors[e % colors.length],
                        textColor: Color.parse('#ffffff'),
                        textSize: 20,
                        bgColor: Color.parse(colors[e % colors.length]),
                        layoutConfig: {
                            widthSpec: LayoutSpec.EXACTLY,
                            heightSpec: LayoutSpec.EXACTLY,
                        },
                        width: 200,
                        height: 50,
                    })),
                ]
                ),
            ]
        )))
    }
}