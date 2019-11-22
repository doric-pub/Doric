import { storage, Panel, scroller, vlayout, text, layoutConfig, LayoutSpec, Color, gravity, IVLayout, Group, IText, modal, Text, log, loge } from "doric";
import { colors, label } from "./utils";
const storedKey = 'StoredKey'
const zone = 'StorageDemo'
@Entry
class StorageDemo extends Panel {
    stored!: Text

    update() {
        storage(context).getItem(storedKey).then(e => {
            this.stored.text = '12345'
            loge('set Text')
            modal(context).toast('current in then:' + this.stored.isDirty())
        })
    }

    build(root: Group) {
        scroller(vlayout([
            text({
                text: "Storage Demo",
                layoutConfig: layoutConfig().w(LayoutSpec.AT_MOST),
                textSize: 30,
                textColor: Color.WHITE,
                bgColor: colors[1],
                textAlignment: gravity().center(),
                height: 50,
            }),
            label('Stored'),
            text({
                layoutConfig: layoutConfig().w(LayoutSpec.AT_MOST),
                textSize: 20,
                textColor: Color.WHITE,
                bgColor: colors[3],
                textAlignment: gravity().center(),
                height: 50,
            }).also(it => this.stored = it),
            label('store a value').apply({
                width: 200,
                height: 50,
                bgColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
                onClick: () => {
                    storage(context).setItem(storedKey, 'This is my stored value').then(e => {
                        log('Stored')
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
    }

}