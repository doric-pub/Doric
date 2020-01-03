import { Panel, Group, vlayout, layoutConfig, draggable, Color, Text, Draggable, modal, Gravity, loge} from "doric";
import { title } from "./utils";
@Entry
class DraggableDemo extends Panel {
    build(root: Group) {
        let text = (new Text).also(it => {
            it.layoutConfig = layoutConfig().just().configAlignmnet(Gravity.Center)
            it.width = 100
            it.height = 30
            it.textColor = Color.parse('#ff0000')
            it.onClick = () => {
                modal(context).toast('Clicked')
            }
        })
        let drag: Draggable
        let lastX: number = 0
        let lastY: number = 0
        drag = draggable({
            onDrag: (x: number, y: number) => {
                lastX += x
                lastY += y
                drag.translationX = lastX
                drag.translationY = lastY
                loge(lastX)
                text.text = "x: " + lastX.toFixed(0) + " y: " + lastY.toFixed(0)
            }
        }, [ text ]).apply({
            layoutConfig: layoutConfig().just(),
            width: 100,
            height: 100,
            backgroundColor: Color.WHITE
        })
        vlayout([
            title("Draggable Demo"),
            drag
        ])
            .apply({
                layoutConfig: layoutConfig().most(),
                backgroundColor: Color.BLACK
            })
            .in(root)
    }

}