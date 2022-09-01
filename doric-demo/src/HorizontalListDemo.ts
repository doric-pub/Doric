import { Group, text, HorizontalList, gravity, Color, LayoutSpec, log, vlayout, layoutConfig, ViewHolder, ViewModel, VMPanel, loge, modal, stack, horizontalList, horizontalListItem } from "doric";

interface ItemModel {
    text: string
}

interface ListModel {
    end: boolean
    offset: number
    data: ItemModel[]
}

async function loadData(offset: number): Promise<{
    isEnd: boolean,
    data: ItemModel[]
}> {
    return new Promise<{
        isEnd: boolean,
        data: ItemModel[]
    }>(resolve => {
        setTimeout(() => {
            resolve({
                isEnd: offset > 100,
                data: new Array(5).fill(offset).map((e, idx) => {
                    return { text: `Item: ${e + idx}` }
                })
            })
        }, 1000)
    })
}

class ListVH extends ViewHolder {
    list!: HorizontalList
    build(root: Group) {
        vlayout(
            [
                text({
                    text: "HorizontalList Demo",
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.JUST,
                    },
                    textSize: 30,
                    textColor: Color.parse("#535c68"),
                    backgroundColor: Color.parse("#dff9fb"),
                    textAlignment: gravity().center(),
                    height: 50,
                }),
                this.list = horizontalList({
                    itemCount: 0,
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.JUST,
                        weight: 1
                    },
                })
            ],
            {
                layoutConfig: layoutConfig().most(),
                backgroundColor: Color.WHITE
            }).in(root)
    }
}

class ListVM extends ViewModel<ListModel, ListVH> {
    onAttached(state: ListModel, vh: ListVH) {
        vh.list.apply({
            canDrag: true,
            itemCanDrag: (from) => {
                if (from === 0) {
                    return false;
                } else {
                    return true;
                }
            },
            beforeDragging: (from) => {
                return [0, 1, 2]
            },
            onDragging: (from, to) => {
                loge(`onDragging from: ${from}, to: ${to}`)
            },
            onDragged: (from, to) => {
                loge(`onDragged from: ${from}, to: ${to}`)
            },
            renderItem: (index) => {
                const data = state.data[index]
                return horizontalListItem(stack([
                    text({
                        text: data.text,
                        textSize: 20,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                            alignment: gravity().center(),
                            margin: {
                                left: 10,
                                right: 10,
                            }
                        },
                        height: 50,
                        onClick: () => {
                            data.text += "1"
                            vh.list.reload(this.context)
                        },
                    })
                ], {
                    layoutConfig: layoutConfig().fitWidth().mostHeight(),
                }), {
                    layoutConfig: {
                        widthSpec: LayoutSpec.FIT,
                        heightSpec: LayoutSpec.MOST,
                    },
                    border: {
                        width: 1,
                        color: Color.BLACK,
                    }
                    //onClick: () => { modal(context).alert("Item Clicked " + index) }
                }).apply({
                    // actions: [
                    //     {
                    //         title: "First",
                    //         backgroundColor: Color.RED,
                    //         callback: () => {
                    //             modal(context).alert("First action " + index)
                    //         }
                    //     },
                    //     {
                    //         title: "Second",
                    //         backgroundColor: Color.BLUE,
                    //         callback: () => {
                    //             modal(context).alert("Second action " + index)
                    //         }
                    //     }
                    // ]
                })
            },
            onLoadMore: async () => {
                loge(`LoadMore,offset:${state.offset}`)
                const ret = await loadData(state.offset)
                this.updateState(state => {
                    state.end = ret.isEnd
                    state.data = state.data.concat(ret.data)
                    state.offset = state.data.length
                })
            },
            onScrollEnd: async () => {
                const ret = await vh.list.findCompletelyVisibleItems(context)
                loge('completelyVisible Items is:', ret)
                const ret2 = await vh.list.findVisibleItems(context)
                loge('visible Items is:', ret2)
            }
        })
        loadData(state.offset).then(ret => {
            this.updateState(state => {
                state.end = ret.isEnd
                state.data = state.data.concat(ret.data)
                state.offset = state.data.length
            })
        })
    }

    onBind(state: ListModel, vh: ListVH) {
        vh.list.apply({
            itemCount: state.data.length,
            loadMore: !state.end
        })
        loge(`onBind,itemCount:${vh.list.itemCount}`)
    }
}

@Entry
class ListPanel extends VMPanel<ListModel, ListVH> {
    getViewModelClass() {
        return ListVM
    }
    getViewHolderClass() {
        return ListVH
    }
    getState() {
        return {
            end: true,
            data: [],
            offset: 0
        }
    }
}