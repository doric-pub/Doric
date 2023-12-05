import { Group, Panel, switchView, text, Color, vlayout, Gravity, layoutConfig, Text } from "doric";

export class SwitchDemo extends Panel {
  build(rootView: Group): void {
    let switchStatus: Text
    vlayout(
      [
        switchStatus = text({
          text: "Switch开关"
        }),
      switchView({
        state: true,
        onSwitch: (state) => {
          switchStatus.text = `Switch 当前状态:${state ? "ON" : "OFF"}`
        },
      }),
      switchView({
        state: true,
        onSwitch: (state) => {
          switchStatus.text = `Switch 当前状态:${state ? "ON" : "OFF"}`
        },
        // backgroundColor: Color.RED,
        offTintColor: Color.RED,
        onTintColor: Color.YELLOW,
        thumbTintColor: Color.RED,
      }),
      ],
      {
        layoutConfig: layoutConfig().most(),
        space: 20,
        gravity: Gravity.Center
      }).into(rootView)
  }
}