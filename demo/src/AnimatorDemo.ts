import { animate, Group, Panel, gravity, Color, AnimationSet, vlayout, scroller, layoutConfig, IVLayout, modal, IText, network, View, stack, IHLayout, hlayout, IView, text, TranslationAnimation, ScaleAnimation, RotationAnimation, FillMode } from "doric";
import { title, colors, box } from "./utils";

function thisLabel(str: string) {
    return text({
        text: str,
        width: 60,
        height: 50,
        bgColor: colors[0],
        textSize: 15,
        textColor: Color.WHITE,
        layoutConfig: layoutConfig().exactly(),
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
                                        view.x = view.y = 0
                                        view.rotation = 0
                                        view.bgColor = colors[2]
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
                        }),
                    ]).apply({ space: 10 } as IHLayout),
                    hlayout([
                        thisLabel('X').apply({
                            onClick: () => {
                                animate(this)({
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
                                animate(this)({
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
                                animate(this)({
                                    animations: () => {
                                        view.width += 100
                                    },
                                    duration: 1000,
                                })
                            }
                        }),
                        thisLabel('Height').apply({
                            onClick: () => {
                                animate(this)({
                                    animations: () => {
                                        view.height += 100
                                    },
                                    duration: 1000,
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
                                    duration: 1000,
                                });
                            }
                        }),
                        thisLabel('Rotation').apply({
                            onClick: () => {
                                animate(this)({
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
                                animate(this)({
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
                    ]).apply({ space: 10 } as IHLayout),

                    hlayout([
                        thisLabel('scaleX').apply({
                            onClick: () => {
                                animate(this)({
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
                                animate(this)({
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
                        thisLabel('animationSet').apply({
                            onClick: () => {
                                const animationSet = new AnimationSet
                                animationSet.fillMode = FillMode.Forward
                                animationSet.delay = 2000
                                const translate = new TranslationAnimation
                                translate.fromTranslationX = 100
                                translate.toTranslationX = 200
                                translate.fromTranslationY = 10
                                translate.toTranslationY = 200
                                translate.duration = 2000
                                translate.delay = 1000
                                const scale = new ScaleAnimation
                                scale.fromScaleX = 1
                                scale.toScaleX = 5
                                scale.fromScaleY = 1
                                scale.toScaleY = 5
                                //scale.delay = 1000
                                scale.duration = 2000
                                const rotation = new RotationAnimation
                                rotation.fromRotation = 0
                                rotation.toRotation = 6.2
                                rotation.duration = 3000
                                animationSet.addAnimation(translate)
                                animationSet.addAnimation(scale)
                                animationSet.addAnimation(rotation)

                                view.doAnimation(context, animationSet).then(() => {
                                    modal(context).toast('Animation finished')
                                })
                            }
                        }),
                    ]).apply({ space: 10 } as IHLayout),
                ]
            ).apply({ space: 10 } as IVLayout),
            stack([
                view,
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