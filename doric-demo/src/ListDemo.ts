import { Group, Panel, List, text, gravity, Color, LayoutSpec, list, listItem, log, vlayout, Gravity, hlayout, Text, refreshable, Refreshable, ListItem, layoutConfig, ViewHolder, ViewModel, VMPanel, loge, modal } from "doric";

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
    list!: List
    build(root: Group) {
        vlayout(
            [
                text({
                    text: "ListDemo",
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
                this.list = list({
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
            renderItem: (index) => {
                const data = state.data[index]
                return listItem(text({
                    text: data.text,
                    textSize: 20,
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.JUST,
                    },
                    height: 50
                }), {
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.FIT,
                    }
                }).apply({
                    actions: [
                        {
                            title: "First",
                            backgroundColor: Color.RED,
                            callback: () => {
                                modal(context).alert("First action")
                            }
                        },
                        {
                            title: "Second",
                            backgroundColor: Color.BLUE,
                            callback: () => {
                                modal(context).alert("Second action")
                            }
                        }
                    ]
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