import { storage, Panel, scroller, vlayout, text, layoutConfig, LayoutSpec, Color, gravity, IVLayout, Group, IText, modal, Text, log, loge } from "doric";
import { colors, label } from "./utils";
const storedKey = 'StoredKey'
const zone = 'StorageDemo'
@Entry
class StorageDemo extends Panel {
    stored!: Text

    update() {
        storage(context).getItem(storedKey, zone).then(e => {
            this.stored.text = e || ""
            log('Called in then')
        })
    }

    build(root: Group) {
        scroller(vlayout([
            text({
                text: "Storage Demo",
                layoutConfig: layoutConfig().w(LayoutSpec.AT_MOST),
                textSize: 30,
                textColor: Color.WHITE,
                backgroundColor: colors[1],
                textAlignment: gravity().center(),
                height: 50,
            }),
            label('Stored'),
            text({
                layoutConfig: layoutConfig().w(LayoutSpec.AT_MOST),
                textSize: 20,
                textColor: Color.WHITE,
                backgroundColor: colors[3],
                textAlignment: gravity().center(),
                height: 50,
            }).also(it => this.stored = it),
            label('store a value').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
                onClick: () => {
                    storage(context).getItem(storedKey, zone).then(e => {
                        modal(context).prompt({
                            text: e,
                            title: "Please input text to store",
                            defaultText: "Default Value",
                        }).then(text => {
                            storage(context).setItem(storedKey, text, zone).then(() => {
                                this.update()
                            })
                        })
                    })
                },
            } as IText),
            label('remove value').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
                onClick: () => {
                    storage(context).remove(storedKey, zone).then(e => {
                        this.update()
                    })
                },
            } as IText),
            label('clear values').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
                onClick: () => {
                    storage(context).clear(zone).then(e => {
                        this.update()
                    })
                },
            } as IText),
        ]).apply({
            layoutConfig: layoutConfig().atmost().h(LayoutSpec.WRAP_CONTENT),
            gravity: gravity().center(),
            space: 10,
        } as IVLayout)).apply({
            layoutConfig: layoutConfig().atmost(),
        }).in(root)
        this.update()
    }

}