
import { Group, Panel, Color, View, layoutConfig, stack, vlayout, text, Gravity, TranslationAnimation } from "doric";

export class AnimationsDemo extends Panel {
  build(root: Group) {
    const animation = new TranslationAnimation
    animation.fromTranslationX = 0
    animation.toTranslationX = 100
    animation.duration = 5000
    let view: View
    vlayout(
      [
        view = stack([], {
          layoutConfig: layoutConfig().just(),
          width: 20,
          height: 20,
          backgroundColor: Color.BLUE,
        }),

      text({
        text: "Start",
        onClick: () => {
          view.doAnimation(this.context, animation)
        }
      }),

      text({
        text: "Cancel",
        onClick: () => {
          view.cancelAnimation(this.context, animation)
        }
      }),

      text({
        text: "Clear",
        onClick: () => {
          view.clearAnimation(this.context, animation)
        }
      }),
      ],
      {
        space: 20,
        layoutConfig: layoutConfig().most(),
        gravity: Gravity.Center
      }).into(root)
  }
}