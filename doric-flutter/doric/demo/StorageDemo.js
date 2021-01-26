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

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const storedKey = 'StoredKey';
const zone = 'StorageDemo';
let StorageDemo = class StorageDemo extends doric.Panel {
    update() {
        doric.storage(context).getItem(storedKey, zone).then(e => {
            this.stored.text = e || "";
            doric.log('Called in then');
        });
    }
    build(root) {
        doric.scroller(doric.vlayout([
            doric.text({
                text: "Storage Demo",
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[1],
                textAlignment: doric.gravity().center(),
                height: 50,
            }),
            label('Stored'),
            doric.text({
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                textSize: 20,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[3],
                textAlignment: doric.gravity().center(),
                height: 50,
            }).also(it => this.stored = it),
            label('store a value').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: () => {
                    doric.storage(context).getItem(storedKey, zone).then(e => {
                        doric.modal(context).prompt({
                            text: e,
                            title: "Please input text to store",
                            defaultText: "Default Value",
                        }).then(text => {
                            doric.storage(context).setItem(storedKey, text, zone).then(() => {
                                this.update();
                            });
                        });
                    });
                },
            }),
            label('remove value').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: () => {
                    doric.storage(context).remove(storedKey, zone).then(e => {
                        this.update();
                    });
                },
            }),
            label('clear values').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: () => {
                    doric.storage(context).clear(zone).then(e => {
                        this.update();
                    });
                },
            }),
        ]).apply({
            layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT),
            gravity: doric.gravity().center(),
            space: 10,
            backgroundColor:doric.Color.RED,
        })).apply({
            layoutConfig: doric.layoutConfig().most(),
        }).in(root);
        this.update();
    }
};
StorageDemo = __decorate([
    Entry
], StorageDemo);
//# sourceMappingURL=StorageDemo.js.map
