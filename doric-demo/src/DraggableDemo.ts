import { Panel, Group, vlayout, layoutConfig, draggable, Color, Text, Draggable, modal, Gravity, stack} from "doric";
import { title } from "./utils";
@Entry
class DraggableDemo extends Panel {
    build(root: Group) {
        let text = (new Text).also(it => {
            it.layoutConfig = layoutConfig().just().configAlignment(Gravity.Center)
            it.width = 100
            it.height = 30
            it.textColor = Color.parse('#ff0000')
            it.onClick = () => {
                modal(context).toast('Clicked')
            }
        })
        let drag: Draggable
        drag = draggable({
            onDrag: (x: number, y: number) => {
                text.text = "x: " + x.toFixed(0) + " y: " + y.toFixed(0)
            }
        }, [ text ]).apply({
            layoutConfig: layoutConfig().just(),
            width: 100,
            height: 100,
            backgroundColor: Color.WHITE
        })
        vlayout([
            title("Draggable Demo"),
            stack([
                drag,
            ]).apply({
                layoutConfig: layoutConfig().most()
            })
        ])
            .apply({
                layoutConfig: layoutConfig().most(),
                backgroundColor: Color.BLACK
            })
            .in(root)
    }

}