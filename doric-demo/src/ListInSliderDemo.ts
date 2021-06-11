import { Color, Group, layoutConfig, list, listItem, modal, Panel, slider, stack, text } from "doric";

@Entry
class ListInSlider extends Panel {
    build(root: Group) {
        slider({
            layoutConfig: layoutConfig().most(),
            itemCount: 2,
            renderPage: (idx) => {
                if (idx === 0) {
                    return listItem(
                        list({
                            itemCount: 100,
                            layoutConfig: layoutConfig().most(),
                            renderItem: (idx) => {
                                return listItem(
                                    text({
                                        text: `Item ${idx}`,
                                        onClick: () => {
                                            modal(context).alert(`Clicked ${idx}`)
                                        }
                                    }))
                            }
                        }),
                        {
                            layoutConfig: layoutConfig().most(),
                        })
                }
                return listItem(
                    stack([], {
                        layoutConfig: layoutConfig().most(),
                        backgroundColor: idx === 0 ? Color.BLUE : Color.GREEN,
                    }),
                    {
                        layoutConfig: layoutConfig().most(),
                    })
            }
        }).in(root)
    }
}