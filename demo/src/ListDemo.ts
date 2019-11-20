import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text } from "doric";
const colors = [
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
]
@Entry
class ListPanel extends Panel {
    build(rootView: Group): void {
        vlayout([
            text({
                text: "ListDemo",
                layoutConfig: {
                    widthSpec: LayoutSpec.AT_MOST,
                    heightSpec: LayoutSpec.EXACTLY,
                },
                textSize: 30,
                textColor: Color.parse("#535c68"),
                bgColor: Color.parse("#dff9fb"),
                textAlignment: gravity().center(),
                height: 50,
            }),
            list({
                itemCount: 1000,
                renderItem: (idx: number) => {
                    let counter!: Text
                    return listItem(
                        hlayout([
                            text({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.WRAP_CONTENT,
                                    heightSpec: LayoutSpec.EXACTLY,
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
                            }).also(it => {
                                counter = it
                                it.layoutConfig = {
                                    widthSpec: LayoutSpec.WRAP_CONTENT,
                                    heightSpec: LayoutSpec.WRAP_CONTENT,
                                    margin: {
                                        left: 10,
                                    }
                                }
                            })
                        ]).also(it => {
                            it.layoutConfig = {
                                widthSpec: LayoutSpec.AT_MOST,
                                heightSpec: LayoutSpec.WRAP_CONTENT,
                                margin: {
                                    bottom: 2,
                                }
                            }
                            it.gravity = gravity().center()
                            it.bgColor = Color.parse(colors[idx % colors.length])
                            let clicked = 0
                            it.onClick = () => {
                                counter.text = `Item Clicked ${++clicked}`
                            }
                        })
                    ).also(it => {
                        it.layoutConfig = {
                            widthSpec: LayoutSpec.AT_MOST,
                            heightSpec: LayoutSpec.WRAP_CONTENT,
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
                },
                layoutConfig: {
                    widthSpec: LayoutSpec.AT_MOST,
                    heightSpec: LayoutSpec.AT_MOST,
                },
            }),
        ]).also(it => {
            it.layoutConfig = {
                widthSpec: LayoutSpec.AT_MOST,
                heightSpec: LayoutSpec.AT_MOST,
            }
            it.bgColor = Color.WHITE
        }).in(rootView)
    }
}