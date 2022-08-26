import { Group, Panel, flowlayout, layoutConfig, text, Color, LayoutSpec, Gravity, flowItem } from "doric";
import { loge } from "doric/lib/src/util/log";
import { colors } from "./utils";

@Entry
class FlowLayoutDragDemo extends Panel {
    private data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    build(rootView: Group) {
        function insertAt(array: Array<any>, index: number, ...elements: Array<any>) {
            array.splice(index, 0, ...elements);
        }

        const flowView = flowlayout({
            layoutConfig: layoutConfig().most(),
            itemCount: this.data.length,
            columnCount: 3,
            columnSpace: 10,
            rowSpace: 10,
            renderItem: (idx) => {
                return flowItem(
                    text({
                        text: `${this.data[idx]}`,
                        textColor: Color.WHITE,
                        textSize: 20,
                        layoutConfig: layoutConfig().fit().configAlignment(Gravity.Center)
                    }),
                    {
                        backgroundColor: colors[this.data[idx] % colors.length],
                        height: 50,
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
                        onClick: async () => {
                            const ret = await flowView.findCompletelyVisibleItems(context)
                            loge(ret)
                        }
                    }
                )
            },
            onScrollEnd: async () => {
                const ret = await flowView.findCompletelyVisibleItems(context)
                loge('completelyVisible Items is:', ret)

                const ret2 = await flowView.findVisibleItems(context)
                loge('visible Items is:', ret2)
            },
            canDrag: true,
            itemCanDrag: (from) => {
                if (from === 0) {
                    return false;
                } else {
                    return true;
                }
            },
            beforeDragging: (from) => {
                if (from === 0) {
                    return new Array(this.data.length + 1).fill(0).map((_, index) => index)
                }
                loge(`beforeDragging from: ${from}`)
                return [0, 1, 2, 9, 10, 15]
            },
            onDragging: (from, to) => {
                loge(`onDragging from: ${from}, to: ${to}`)
            },
            onDragged: (from, to) => {
                loge(`onDragged from: ${from}, to: ${to}`)

                const tmp = this.data[from]
                this.data.splice(from, 1)
                insertAt(this.data, to, tmp)
                loge(this.data)
                flowView.reload(this.context)
            }
        }).in(rootView)

    }
}