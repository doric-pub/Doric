import { Group, Panel, vlayout, scroller, text, layoutConfig, stack, Color, View, Scroller } from "doric";

const colors = [
    "#70a1ff",
    "#7bed9f",
    "#ff6b81",
    "#a4b0be",
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
].map(e => Color.parse(e))

function titleBar() {
    return text({
        text: "This is a sticky header",
        layoutConfig: layoutConfig().mostWidth().justHeight(),
        height: 50,
        backgroundColor: Color.YELLOW
    })
}

@Entry
export class StickyHeaderDemo extends Panel {
    build(root: Group) {
        let stickyHeader: View
        let scrollerView: Scroller
        stack(
            [
                scroller(
                    vlayout(
                        [
                            stack([], {
                                layoutConfig: layoutConfig().mostWidth().justHeight(),
                                height: 80,
                                backgroundColor: Color.GRAY,
                            }),
                            titleBar(),
                            ...new Array(20).fill(0).map((_, index) => stack([], {
                                layoutConfig: layoutConfig().mostWidth().justHeight(),
                                height: 80,
                                backgroundColor: colors[index % colors.length]
                            })),
                        ],
                        {
                            layoutConfig: layoutConfig().mostWidth().fitHeight(),
                        }
                    ),
                    {
                        layoutConfig: layoutConfig().most(),
                        onScroll: (offset) => {
                            stickyHeader.hidden = offset.y <= 80
                        }
                    }),
                stickyHeader = titleBar().apply({ hidden: true }),
            ],
            {
                layoutConfig: layoutConfig().most(),
            }).in(root)
    }
}