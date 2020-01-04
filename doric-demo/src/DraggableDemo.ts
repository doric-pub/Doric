import { Panel, Group, vlayout, layoutConfig, draggable, Color, Text, Draggable, modal, Gravity, stack, text } from "doric";
import { title } from "./utils";
@Entry
class DraggableDemo extends Panel {
    build(root: Group) {
        let textView: Text
        let drag = draggable(
            textView = text({
                layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                width: 100,
                height: 30,
                textColor: Color.RED,
                onClick: () => {
                    modal(context).toast('Clicked')
                }
            }),
            {
                onDrag: (x: number, y: number) => {
                    textView.text = "x: " + x.toFixed(0) + " y: " + y.toFixed(0)
                },
                layoutConfig: layoutConfig().just(),
                width: 100,
                height: 100,
                backgroundColor: Color.WHITE
            })
        vlayout(
            [
                title("Draggable Demo"),
                stack(
                    [
                        drag,
                    ],
                    {
                        layoutConfig: layoutConfig().most()
                    })
            ],
            {
                layoutConfig: layoutConfig().most(),
                backgroundColor: Color.BLACK
            })
            .in(root)
    }

}