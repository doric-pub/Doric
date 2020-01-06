import { animate, Group, Panel, gravity, Color, AnimationSet, vlayout, scroller, layoutConfig, IVLayout, modal, IText, network, View, stack, IHLayout, hlayout, IView, text, TranslationAnimation, ScaleAnimation, RotationAnimation, FillMode } from "doric";
import { title, colors, box } from "./utils";

function thisLabel(str: string) {
    return text({
        text: str,
        width: 60,
        height: 50,
        backgroundColor: colors[0],
        textSize: 15,
        textColor: Color.WHITE,
        layoutConfig: layoutConfig().just(),
    })
}

@Entry
class AnimatorDemo extends Panel {
    build(rootView: Group): void {
        const view = box(2)
        view.onClick = () => {
            modal(context).toast('Clicked')
        }
        const view2 = box(3)
        let idx = 0
        vlayout(
            [
                title("Animator Demo"),
                vlayout(
                    [
                        hlayout(
                            [thisLabel('Reset').apply({
                                onClick: () => {
                                    animate(context)({
                                        animations: () => {
                                            view.width = view.height = 20
                                            view.x = view.y = 0
                                            view.rotation = 0
                                            view.backgroundColor = colors[2]
                                            view.corners = 0
                                            view.scaleX = 1
                                            view.scaleY = 1
                                            view.translationX = 0
                                            view.translationY = 0
                                            view.rotation = 0
                                        },
                                        duration: 1500,
                                    }).then(() => {
                                        modal(context).toast('Fininshed')
                                    }).catch(e => {
                                        modal(context).toast(`${e}`)
                                    })
                                }
                            }),],
                            { space: 10 }
                        ),
                        hlayout(
                            [
                                thisLabel('X').apply({
                                    onClick: () => {
                                        animate(context)({
                                            animations: () => {
                                                view.x = view.x || 0
                                                view.x += 100
                                                view2.x += 50
                                            },
                                            duration: 1000,
                                        })
                                    }
                                }),
                                thisLabel('Y').apply({
                                    onClick: () => {
                                        animate(context)({
                                            animations: () => {
                                                view.y = view.y || 0
                                                view.y += 100
                                                view2.y += 50
                                            },
                                            duration: 1000,
                                        })
                                    }
                                }),
                                thisLabel('Width').apply({
                                    onClick: () => {
                                        animate(context)({
                                            animations: () => {
                                                view.width += 100
                                            },
                                            duration: 1000,
                                        })
                                    }
                                }),
                                thisLabel('Height').apply({
                                    onClick: () => {
                                        animate(context)({
                                            animations: () => {
                                                view.height += 100
                                            },
                                            duration: 1000,
                                        })
                                    }
                                }),
                            ],
                            { space: 10 }
                        ),
                        hlayout(
                            [
                                thisLabel('BgColor').apply({
                                    onClick: () => {
                                        animate(context)({
                                            animations: () => {
                                                view.backgroundColor = colors[(idx++) % colors.length]
                                            },
                                            duration: 1000,
                                        });
                                    }
                                }),
                                thisLabel('Rotation').apply({
                                    onClick: () => {
                                        animate(context)({
                                            animations: () => {
                                                if (view.rotation) {
                                                    view.rotation += 0.5
                                                } else {
                                                    view.rotation = 0.5
                                                }
                                            },
                                            duration: 1000,
                                        });
                                    }
                                }),
                                thisLabel('Corner').apply({
                                    onClick: () => {
                                        animate(context)({
                                            animations: () => {
                                                if (typeof view.corners === 'number') {
                                                    view.corners += 10
                                                } else {
                                                    view.corners = 10
                                                }
                                            },
                                            duration: 1000,
                                        });
                                    }
                                }),
                            ],
                            { space: 10 }
                        ),

                        hlayout([
                            thisLabel('scaleX').apply({
                                onClick: () => {
                                    animate(context)({
                                        animations: () => {
                                            if (view.scaleX) {
                                                view.scaleX += 0.1
                                            } else {
                                                view.scaleX = 1.1
                                            }
                                        },
                                        duration: 1000,
                                    });
                                }
                            }),
                            thisLabel('scaleY').apply({
                                onClick: () => {
                                    animate(context)({
                                        animations: () => {
                                            if (view.scaleY) {
                                                view.scaleY += 0.1
                                            } else {
                                                view.scaleY = 1.1
                                            }
                                        },
                                        duration: 1000,
                                    });
                                }
                            }),
                        ]).apply({ space: 10 } as IHLayout),
                    ],
                    { space: 10 }
                ),
                stack(
                    [
                        view,
                    ],
                    {
                        layoutConfig: layoutConfig().most(),
                        backgroundColor: colors[1].alpha(0.3 * 255),
                    }),
            ],
            {
                layoutConfig: layoutConfig().most(),
                gravity: gravity().center(),
                space: 10,
            }
        ).in(rootView)
    }
}