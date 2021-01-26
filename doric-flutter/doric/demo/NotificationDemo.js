'use strict';

var doric = require('doric');

const colors = [
    "#70a1ff",
    "#7bed9f",
    "#ff6b81",
    "#a4b0be",
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
].map(e => doric.Color.parse(e));
function label(str) {
    return doric.text({
        text: str,
        textSize: 16,
    });
}
function title(str) {
    return doric.text({
        text: str,
        layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
        textSize: 30,
        textColor: doric.Color.WHITE,
        backgroundColor: colors[1],
        textAlignment: doric.gravity().center(),
        height: 50,
    });
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let NotificationDemo = class NotificationDemo extends doric.Panel {
    build(rootView) {
        doric.scroller(doric.vlayout([
            title("Notification Demo"),
            label('Publish').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: () => {
                    doric.notification(context).publish({
                        biz: "Test",
                        name: "Demo",
                        data: {
                            a: "1",
                            b: "2",
                        }
                    });
                }
            }),
            label('Subscribe').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: () => {
                    doric.notification(context).subscribe({
                        biz: "Test",
                        name: "Demo",
                        callback: (data) => {
                            doric.modal(context).alert(`Received notification,data is ${JSON.stringify(data)}`);
                        }
                    }).then(e => {
                        this.subscribeId = e;
                    });
                }
            }),
            label('Unsubscribe').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: () => {
                    if (this.subscribeId) {
                        doric.notification(context).unsubscribe(this.subscribeId).then(e => {
                            this.subscribeId = undefined;
                        });
                    }
                }
            }),
        ]).apply({
            layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT),
            gravity: doric.gravity().center(),
            space: 10,
        })).apply({
            layoutConfig: doric.layoutConfig().most(),
        }).in(rootView);
    }
};
NotificationDemo = __decorate([
    Entry
], NotificationDemo);
//# sourceMappingURL=NotificationDemo.js.map
