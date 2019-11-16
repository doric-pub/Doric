import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout } from "doric";
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
        rootView.addChild(vlayout([
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
                                bgColor: Color.parse('#00ff00'),
                            }),
                            text({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.EXACTLY,
                                    heightSpec: LayoutSpec.EXACTLY,
                                    alignment: gravity().center(),
                                    weight: 1,
                                },
                                text: `Right`,
                                textAlignment: gravity().right(),
                                textColor: Color.parse("#ffffff"),
                                textSize: 20,
                                height: 50,
                                bgColor: Color.parse('#00ffff'),
                            }),
                        ]).also(it => {
                            it.layoutConfig = {
                                widthSpec: LayoutSpec.AT_MOST,
                                heightSpec: LayoutSpec.WRAP_CONTENT,
                                alignment: gravity().center(),
                            }
                            it.bgColor = Color.parse('#ffffff')
                        })
                    ).also(it => {
                        it.bgColor = Color.parse(colors[idx % colors.length])
                        it.layoutConfig = {
                            widthSpec: LayoutSpec.AT_MOST,
                            heightSpec: LayoutSpec.EXACTLY,
                        }
                        it.height = 100
                        it.onClick = () => {
                            log(`Click item at ${idx}`)
                            it.height += 10
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
        }))
    }
}