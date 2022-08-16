import { Panel, Group, layoutConfig, Color, stack, list, listItem, text, loge, Gravity } from "doric"
import { colors } from "./utils"

@Entry
class SectionListDemo extends Panel {

    private data = [{
        // title
        type: 'title',
        value: 1
    }, {
        type: 'cell',
        value: 1
    }, {
        type: 'cell',
        value: 2
    }, {
        type: 'cell',
        value: 3
    }, {
        // title
        type: 'title',
        value: 2
    }, {
        type: 'cell',
        value: 1
    }, {
        type: 'cell',
        value: 2
    }, {
        type: 'cell',
        value: 3
    }, {
        type: 'cell',
        value: 4
    }]

    build(root: Group) {
        stack(
            [
                list({
                    itemCount: this.data.length,
                    renderItem: (idx) => {
                        if (this.data[idx].type === 'title') {
                            return listItem(text({
                                text: `Title :${this.data[idx].value}`,
                                layoutConfig: layoutConfig().just().configMargin({
                                    top: (this.data[idx].value === 1) ? 0 : 20
                                }),
                                width: root.width,
                                textAlignment: Gravity.Left,
                                height: 50,
                                textColor: Color.WHITE,
                                backgroundColor: colors[idx % colors.length],
                            }))
                        } else {
                            return listItem(text({
                                text: `Item :${this.data[idx].value}`,
                                layoutConfig: layoutConfig().just(),
                                width: root.width,
                                height: 100,
                                textColor: Color.WHITE,
                                backgroundColor: colors[idx % colors.length],
                            }))
                        }

                    },
                    layoutConfig: layoutConfig().most(),
                })
            ],
            {
                layoutConfig: layoutConfig().most()
            }
        ).in(root)
    }
}