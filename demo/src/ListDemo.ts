import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, ListItem, NativeCall, listItem, log } from "doric";
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
        const list = new List
        list.layoutConfig = {
            widthSpec: LayoutSpec.AT_MOST,
            heightSpec: LayoutSpec.AT_MOST,
        }
        rootView.addChild(list)
        list.itemCount = 1000
        list.renderItem = (idx) => {
            return listItem(text({
                layoutConfig: {
                    widthSpec: LayoutSpec.AT_MOST,
                    heightSpec: LayoutSpec.WRAP_CONTENT,
                    margin: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10,
                    },
                },
                text: `Cell At Line ${idx}`,
                textAlignment: gravity().center(),
                textColor: Color.parse("#ffffff"),
                textSize: 20,
            })).also(it => {
                it.gravity = gravity().center()
                it.bgColor = Color.parse(colors[idx % colors.length])
                it.layoutConfig = {
                    widthSpec: LayoutSpec.AT_MOST,
                    heightSpec: LayoutSpec.EXACTLY,
                }
                it.height = 50
                it.onClick = () => {
                    log(`Click item at ${idx}`)
                    it.bgColor = Color.parse('#000000')
                    log(`changed,listview is dirty:${list.isDirty()}`)
                }
            })
        }
    }
}