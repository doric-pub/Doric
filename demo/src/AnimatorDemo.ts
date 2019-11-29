import { animate, Group, Panel, gravity, Color, LayoutSpec, vlayout, scroller, layoutConfig, IVLayout, modal, IText, network, View, stack, IHLayout, hlayout, IView, text } from "doric";
import { title, colors, box } from "./utils";

function thisLabel(str: string) {
    return text({
        text: str,
        width: 100,
        height: 50,
        bgColor: colors[4],
        textSize: 20,
        textColor: Color.WHITE,
        layoutConfig: layoutConfig().exactly(),
    })
}

@Entry
class AnimatorDemo extends Panel {
    build(rootView: Group): void {
        const view = box(2)
        let idx = 0
        vlayout([
            title("Animator Demo"),
            vlayout(
                [
                    hlayout([
                        thisLabel('Reset').apply({
                            onClick: () => {
                                animate(this)({
                                    animations: () => {
                                        view.width = view.height = 20
                                    },
                                    duration: 3000,
                                }).then(() => {
                                    modal(context).toast('Fininshed')
                                }).catch(e => {
                                    modal(context).toast(`${e}`)
                                })
                            }
                        }),
                    ]),
                    hlayout([
                        thisLabel('Width').apply({
                            onClick: () => {
                                animate(this)({
                                    animations: () => {
                                        view.width = 200
                                    },
                                    duration: 3000,
                                })
                            }
                        }),
                        thisLabel('Height').apply({
                            onClick: () => {
                                animate(this)({
                                    animations: () => {
                                        view.height = 200
                                    },
                                    duration: 3000,
                                })
                            }
                        }),
                    ]).apply({ space: 10 } as IHLayout),
                    hlayout([
                        thisLabel('BgColor').apply({
                            onClick: () => {
                                animate(this)({
                                    animations: () => {
                                        view.bgColor = colors[(idx++) % colors.length]
                                    },
                                    duration: 3000,
                                });
                            }
                        }),
                    ]).apply({ space: 10 } as IHLayout),
                ]
            ).apply({ space: 10 } as IVLayout),
            stack([
                view.also(v => {
                    v.left = 20
                })
            ]).apply({
                layoutConfig: layoutConfig().atmost(),
                bgColor: colors[1].alpha(0.3 * 255),
            }),
        ]).apply({
            layoutConfig: layoutConfig().atmost(),
            gravity: gravity().center(),
            space: 10,
        } as IVLayout).in(rootView)
    }
}