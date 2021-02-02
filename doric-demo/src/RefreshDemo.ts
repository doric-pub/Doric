import { Group, Panel, List, text, gravity, Color, LayoutSpec, list, listItem, log, vlayout, Gravity, hlayout, Text, refreshable, Refreshable, ListItem, layoutConfig } from "doric";
import { rotatedArrow, colors } from "./utils";
@Entry
class ListPanel extends Panel {
    build(rootView: Group): void {
        let refreshView: Refreshable
        let offset = Math.ceil(Math.random() * colors.length)
        vlayout(
            [
                text({
                    text: "ListDemo",
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.JUST,
                    },
                    textSize: 30,
                    textColor: Color.parse("#535c68"),
                    backgroundColor: Color.parse("#dff9fb"),
                    textAlignment: gravity().center(),
                    height: 50,
                }),
                refreshView = refreshable({
                    onRefresh: () => {
                        refreshView.setRefreshing(context, false).then(() => {
                            (refreshView.content as List).also(it => {
                                it.reset()
                                offset = Math.ceil(Math.random() * colors.length)
                                it.itemCount = 40
                                it.loadMore = true
                                it.onLoadMore = () => {
                                    setTimeout(() => {
                                        it.itemCount += 10
                                    }, 1000)
                                }
                                it.loadMoreView = listItem(text({
                                    text: "Loading",
                                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.JUST).configAlignment(Gravity.Center),
                                    height: 50,
                                }))
                                it.renderItem = (idx: number) => {
                                    let counter!: Text
                                    return listItem(
                                        hlayout([
                                            text({
                                                layoutConfig: {
                                                    widthSpec: LayoutSpec.FIT,
                                                    heightSpec: LayoutSpec.JUST,
                                                    alignment: gravity().center(),
                                                },
                                                text: `Cell At Line ${idx}`,
                                                textAlignment: gravity().center(),
                                                textColor: Color.parse("#ffffff"),
                                                textSize: 20,
                                                height: 50,
                                            }),
                                            text({
                                                textColor: Color.parse("#ffffff"),
                                                textSize: 20,
                                                text: "",
                                            }).also(it => {
                                                counter = it
                                                it.layoutConfig = {
                                                    widthSpec: LayoutSpec.FIT,
                                                    heightSpec: LayoutSpec.FIT,
                                                    margin: {
                                                        left: 10,
                                                    }
                                                }
                                            })
                                        ]).also(it => {
                                            it.layoutConfig = {
                                                widthSpec: LayoutSpec.MOST,
                                                heightSpec: LayoutSpec.FIT,
                                                margin: {
                                                    bottom: 2,
                                                }
                                            }
                                            it.gravity = gravity().center()
                                            it.backgroundColor = colors[(idx + offset) % colors.length]
                                            let clicked = 0
                                            it.onClick = () => {
                                                counter.text = `Item Clicked ${++clicked}`
                                            }
                                        })
                                    ).also(it => {
                                        it.layoutConfig = {
                                            widthSpec: LayoutSpec.MOST,
                                            heightSpec: LayoutSpec.FIT,
                                        }
                                        it.onClick = () => {
                                            log(`Click item at ${idx}`)
                                            it.height += 10
                                            it.nativeChannel(context, "getWidth")().then(
                                                resolve => {
                                                    log(`resolve,${resolve}`)
                                                },
                                                reject => {
                                                    log(`reject,${reject}`)
                                                })
                                        }
                                    })
                                }
                            })
                        })
                    },
                    header: rotatedArrow(),
                    content: list({
                        itemCount: 0,
                        renderItem: () => new ListItem,
                        layoutConfig: {
                            widthSpec: LayoutSpec.MOST,
                            heightSpec: LayoutSpec.MOST,
                        },
                    }),
                }),

            ],
            {
                layoutConfig: layoutConfig().most(),
                backgroundColor: Color.WHITE
            }).in(rootView)
        refreshView.backgroundColor = Color.YELLOW
    }
}