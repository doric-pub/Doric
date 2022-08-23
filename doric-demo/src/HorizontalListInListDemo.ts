import { Panel, Group, layoutConfig, stack, list, listItem, horizontalList, horizontalListItem } from "doric"
import { colors } from "./utils"

@Entry
class HorizontalListInListDemo extends Panel {

    private data1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    private data2 = [0, 1, 2, 3, 4, 5]

    build(root: Group) {
        stack([
            list({
                itemCount: this.data1.length,
                renderItem: (index1) => {
                    if (index1 % 3 === 0) {
                        return listItem(
                            stack([
                                horizontalList({
                                    itemCount: this.data2.length,
                                    renderItem: (index2) => {
                                        return horizontalListItem(
                                            stack([]).apply({
                                                layoutConfig: layoutConfig().just().configMargin({
                                                    left: 5,
                                                    right: 5,
                                                }),
                                                height: 80,
                                                width: 160,
                                                backgroundColor: colors[index1 % colors.length],
                                            }),
                                        )
                                    },
                                    layoutConfig: layoutConfig().most()
                                })
                            ]).apply({
                                layoutConfig: layoutConfig().just(),
                                height: 80,
                                width: Environment.screenWidth,
                            }),
                        )
                    } else {
                        return listItem(
                            stack([]).apply({
                                layoutConfig: layoutConfig().just(),
                                height: 80,
                                width: Environment.screenWidth,
                                backgroundColor: colors[index1 % colors.length],
                            }),
                        )
                    }
                },
                layoutConfig: layoutConfig().most(),
            })
        ], {
            layoutConfig: layoutConfig().most()
        }).in(root)
    }
}