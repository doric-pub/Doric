import { Panel, Group, vlayout, layoutConfig, draggable, Color, Text} from "doric";
import { title } from "./utils";
@Entry
class DraggableDemo extends Panel {
    build(root: Group) {
        let text = (new Text).also(it => {
            it.layoutConfig = layoutConfig().most()
            it.textColor = Color.parse('#ff0000')
        })
        vlayout([
            title("Draggable Demo"),
            draggable({
                onDrag: (x: number, y: number) => {
                    text.text = "x: " + x + " y: " + y
                }
            }, [ text ]).apply({
                layoutConfig: layoutConfig().just(),
                width: 100,
                height: 100,
                backgroundColor: Color.WHITE
            })
        ])
            .apply({
                layoutConfig: layoutConfig().most(),
                backgroundColor: Color.BLACK
            })
            .in(root)
    }

}