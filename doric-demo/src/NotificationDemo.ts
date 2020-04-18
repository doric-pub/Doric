import { Group, Panel, gravity, Color, LayoutSpec, vlayout, scroller, layoutConfig, modal, notification } from "doric";
import { title, label, colors } from "./utils";

@Entry
class NotificationDemo extends Panel {
    subscribeId?: string
    build(rootView: Group): void {
        scroller(vlayout([
            title("Notification Demo"),
            label('Publish').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    notification(context).publish({
                        biz: "Test",
                        name: "Demo",
                        data: {
                            a: "1",
                            b: "2",
                        }
                    })
                }
            }),
            label('Subscribe').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    notification(context).subscribe({
                        biz: "Test",
                        name: "Demo",
                        callback: (data) => {
                            modal(context).alert(`Received notification,data is ${JSON.stringify(data)}`)
                        }
                    }).then(e => {
                        this.subscribeId = e
                    })
                }
            }),
            label('Unsubscribe').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    if (this.subscribeId) {
                        notification(context).unsubscribe(this.subscribeId).then(e => {
                            this.subscribeId = undefined
                        })
                    }
                }
            }),
        ]).apply({
            layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
            gravity: gravity().center(),
            space: 10,
        })).apply({
            layoutConfig: layoutConfig().most(),
        }).in(rootView)
    }
}