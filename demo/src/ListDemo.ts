import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, ListItem, NativeCall, listItem } from "doric";

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
                text: `第${idx}行内容`,
                textAlignment: gravity().center(),
            })).also(it => {
                it.gravity = gravity().center()
                it.bgColor = Color.parse("#fff00f")
                it.layoutConfig = {
                    widthSpec: LayoutSpec.AT_MOST,
                    heightSpec: LayoutSpec.WRAP_CONTENT,
                }
            })
        }
    }
}