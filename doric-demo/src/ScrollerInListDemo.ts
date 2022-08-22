import { Panel, Group, layoutConfig, Color, stack, list, listItem, text, loge, scroller, hlayout } from "doric"
import { colors } from "./utils"

@Entry
class ScrollerInListDemo extends Panel {

    private data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    build(root: Group) {
        function insertAt(array: Array<any>, index: number, ...elements: Array<any>) {
            array.splice(index, 0, ...elements);
        }

        stack(
            [
                list({
                    itemCount: this.data.length,
                    renderItem: (idx) => {
                        if (idx % 3 === 0) {
                            return listItem(scroller(
                                hlayout([
                                    stack([]).apply({
                                        layoutConfig: layoutConfig().justWidth().justHeight(),
                                        height: 80,
                                        width: 160,
                                        backgroundColor: colors[idx % colors.length],
                                    }),
                                    stack([]).apply({
                                        layoutConfig: layoutConfig().justWidth().justHeight(),
                                        height: 80,
                                        width: 160,
                                        backgroundColor: colors[idx % colors.length],
                                    }),
                                    stack([]).apply({
                                        layoutConfig: layoutConfig().justWidth().justHeight(),
                                        height: 80,
                                        width: 160,
                                        backgroundColor: colors[idx % colors.length],
                                    }),
                                    stack([]).apply({
                                        layoutConfig: layoutConfig().justWidth().justHeight(),
                                        height: 80,
                                        width: 160,
                                        backgroundColor: colors[idx % colors.length],
                                    }),
                                    stack([]).apply({
                                        layoutConfig: layoutConfig().justWidth().justHeight(),
                                        height: 80,
                                        width: 160,
                                        backgroundColor: colors[idx % colors.length],
                                    }),
                                    stack([]).apply({
                                        layoutConfig: layoutConfig().justWidth().justHeight(),
                                        height: 80,
                                        width: 160,
                                        backgroundColor: colors[idx % colors.length],
                                    })
                                ]).apply({
                                    space: 10,
                                })
                            ).apply({
                                layoutConfig: layoutConfig().fitWidth().justHeight(),
                                height: 100,
                            }))
                        } else {
                            return listItem(scroller(
                                hlayout([
                                    stack([]).apply({
                                        layoutConfig: layoutConfig().justWidth().justHeight(),
                                        height: 80,
                                        width: Environment.screenWidth,
                                        backgroundColor: colors[idx % colors.length],
                                    }),
                                ]).apply({
                                    space: 10,
                                })
                            ).apply({
                                layoutConfig: layoutConfig().fitWidth().justHeight(),
                                height: 100,
                            }))
                        }
                    },
                    layoutConfig: layoutConfig().most(),
                })
            ],
            {
                layoutConfig: layoutConfig().most()
            }
        ).in(root)
    }
}