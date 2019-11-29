import { animate, Group, Panel, gravity, Color, LayoutSpec, vlayout, scroller, layoutConfig, IVLayout, modal, IText, network, View, stack } from "doric";
import { title, label, colors, box } from "./utils";

@Entry
class AnimatorDemo extends Panel {
    build(rootView: Group): void {
        const view = box(2)
        vlayout([
            title("Animator Demo"),
            label('Reset').apply({
                width: 100,
                height: 50,
                bgColor: colors[4],
                textSize: 20,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
            } as IText).also(v => {
                v.onClick = () => {
                    animate(this)({
                        animations: () => {
                            view.width = view.height = 20
                        },
                        duration: 3000,
                    }).then(() => {
                        modal(context).toast('Fininshed')
                    }, (e: any) => {
                        modal(context).toast(`${e}`)
                    })
                }
            }),
            label('Width').apply({
                width: 100,
                height: 50,
                bgColor: colors[0],
                textSize: 20,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
            } as IText).also(v => {
                v.onClick = () => {
                    animate(this)({
                        animations: () => {
                            view.width = 300
                        },
                        duration: 3000,
                    }).then(() => {
                        modal(context).toast('Fininshed')
                    }, (e: any) => {
                        modal(context).toast(`${e}`)
                    })
                }
            }),
            label('Height').apply({
                width: 100,
                height: 50,
                bgColor: colors[0],
                textSize: 20,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
            } as IText).also(v => {
                v.onClick = () => {
                    animate(this)({
                        animations: () => {
                            view.height = 300
                        },
                        duration: 3000,
                    }).then(() => {
                        modal(context).toast('Fininshed')
                    }, (e: any) => {
                        modal(context).toast(`${e}`)
                    })
                }
            }),
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