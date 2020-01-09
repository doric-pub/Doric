import { Group, Panel, navbar, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text, scroller, layoutConfig, image, IView, IVLayout, ScaleType, modal, IText, network, navigator, notification } from "doric";
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
            } as IText),
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
            } as IText),
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
            } as IText),
        ]).apply({
            layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
            gravity: gravity().center(),
            space: 10,
        } as IVLayout)).apply({
            layoutConfig: layoutConfig().most(),
        }).in(rootView)
    }
}