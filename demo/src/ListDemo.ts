import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, ListItem } from "doric";

@Entry
class ListPanel extends Panel {
    build(rootView: Group): void {
        const list = new List
        list.layoutConfig = {
            widthSpec: LayoutSpec.AT_MOST,
            heightSpec: LayoutSpec.AT_MOST,
        }
        rootView.addChild(list)
        list.itemCount = 10
        list.bgColor = Color.parse("#ff00ff")
        list.renderItem = (idx) => {
            const item = new ListItem
            item.addChild(text({
                width: 100,
                height: 100,
                text: `第${idx}行内容`,
                textAlignment: gravity().center(),
            }))
            return item
        }
    }

}