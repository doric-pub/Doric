import { animate, Group, Panel, gravity, Color, AnimationSet, vlayout, scroller, layoutConfig, IVLayout, modal, IText, network, View, stack, IHLayout, hlayout, IView, text, TranslationAnimation, ScaleAnimation, RotationAnimation, FillMode } from "doric";
import { title, colors, box } from "./utils";

function thisLabel(str: string) {
    return text({
        text: str,
        width: 80,
        height: 30,
        bgColor: colors[0],
        textSize: 10,
        textColor: Color.WHITE,
        layoutConfig: layoutConfig().exactly(),
    })
}

@Entry
class AnimationDemo extends Panel {
    build(rootView: Group): void {
        const view = box(2)
        view.onClick = () => {
            modal(context).toast('Clicked')
        }
        vlayout([
            title("Complicated Animation"),
            vlayout(
                [
                    hlayout([
                        thisLabel('reset').apply({
                            onClick: () => {
                                const rotation = new RotationAnimation
                                rotation.duration = 1000
                                rotation.fromRotation = view.rotation || 0
                                rotation.toRotation = 0
                                const translation = new TranslationAnimation
                                translation.duration = 1000
                                translation.fromTranslationX = view.translationX || 0
                                translation.toTranslationX = 0
                                translation.fromTranslationY = view.translationY || 0
                                translation.toTranslationY = 0
                                const scale = new ScaleAnimation
                                scale.duration = 1000
                                scale.fromScaleX = view.scaleX || 1
                                scale.toScaleX = 1
                                scale.fromScaleY = view.scaleY || 1
                                scale.toScaleY = 1
                                const animationSet = new AnimationSet
                                animationSet.addAnimation(rotation)
                                animationSet.addAnimation(translation)
                                animationSet.addAnimation(scale)
                                view.doAnimation(context, animationSet).then(() => {
                                    modal(context).toast('Resetd')
                                })
                            }
                        }),
                    ]).apply({ space: 10 } as IHLayout),
                    hlayout([
                        thisLabel('TranslationX').apply({
                            onClick: () => {
                                const animation = new TranslationAnimation
                                animation.duration = 1000
                                animation.fromTranslationX = view.translationX || 0
                                animation.toTranslationX = animation.fromTranslationX + 100
                                animation.fromTranslationY = view.translationY || 0
                                animation.toTranslationY = view.translationY || 0
                                view.doAnimation(context, animation)
                            }
                        }),
                        thisLabel('TranslationY').apply({
                            onClick: () => {
                                const animation = new TranslationAnimation
                                animation.duration = 1000
                                animation.fromTranslationX = view.translationX || 0
                                animation.toTranslationX = view.translationX || 0
                                animation.fromTranslationY = view.translationY || 0
                                animation.toTranslationY = animation.fromTranslationY + 100
                                view.doAnimation(context, animation)
                            }
                        }),
                        thisLabel('ScaleX').apply({
                            onClick: () => {
                                const animation = new ScaleAnimation
                                animation.duration = 1000
                                animation.fromScaleX = view.scaleX || 1
                                animation.toScaleX = animation.fromScaleX + 1
                                view.doAnimation(context, animation)
                            }
                        }),
                        thisLabel('ScaleY').apply({
                            onClick: () => {
                                const animation = new ScaleAnimation
                                animation.duration = 1000
                                animation.fromScaleY = view.scaleY || 1
                                animation.toScaleY = animation.fromScaleY + 1
                                view.doAnimation(context, animation)
                            }
                        }),
                        thisLabel('rotation').apply({
                            onClick: () => {
                                const animation = new RotationAnimation
                                animation.duration = 1000
                                animation.fromRotation = view.rotation || 0
                                animation.toRotation = animation.fromRotation + 0.25
                                view.doAnimation(context, animation)
                            }
                        }),
                    ]).apply({ space: 10 } as IHLayout),
                    hlayout([
                        thisLabel('group').apply({
                            onClick: () => {
                                const rotation = new RotationAnimation
                                rotation.duration = 1000
                                rotation.fromRotation = 0
                                rotation.toRotation = 4
                                const translation = new TranslationAnimation
                                translation.duration = 1000
                                translation.fromTranslationX = view.translationX || 0
                                translation.toTranslationX = 100
                                const animationSet = new AnimationSet
                                animationSet.addAnimation(rotation)
                                animationSet.addAnimation(translation)
                                view.doAnimation(context, animationSet)
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