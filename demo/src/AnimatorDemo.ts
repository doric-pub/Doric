import { Group, Panel, popover, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text, scroller, layoutConfig, image, IView, IVLayout, ScaleType, modal, IText, network, animator, View, stack } from "doric";
import { title, label, colors, box } from "./utils";

@Entry
class AnimatorDemo extends Panel {
    build(rootView: Group): void {
        const view = box(2)
        scroller(vlayout([
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
                    animator(this)({
                        animations: () => {
                            view.width = view.height = 20
                        },
                        duration: 3000,
                        complete: () => {
                            modal(context).toast('Fininshed')
                        },
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
                    animator(this)({
                        animations: () => {
                            view.width = 300
                        },
                        duration: 3000,
                        complete: () => {
                            modal(context).toast('Fininshed')
                        },
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
                    animator(this)({
                        animations: () => {
                            view.height = 500
                        },
                        duration: 3000,
                        complete: () => {
                            modal(context).toast('Fininshed')
                        }
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
            layoutConfig: layoutConfig().atmost().h(LayoutSpec.WRAP_CONTENT),
            gravity: gravity().center(),
            space: 10,
        } as IVLayout)).apply({
            layoutConfig: layoutConfig().atmost(),
        }).in(rootView)
    }
}