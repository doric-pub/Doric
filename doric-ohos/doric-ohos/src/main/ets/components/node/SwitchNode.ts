import { Switch } from 'doric'
import { getGlobalObject } from '../lib/sandbox'
import { DoricViewNode } from '../lib/DoricViewNode'

const Toggle = getGlobalObject("Toggle")
const ToggleType = getGlobalObject("ToggleType")

export class SwitchNode extends DoricViewNode<Switch> {
  TAG = Toggle

  pushing(v: Switch) {
  }

  pop() {
    Toggle.pop()
  }

  blend(v: Switch) {
    Toggle.create({ type: ToggleType.Switch, isOn: v.state })

    if (v.onSwitch) {
      Toggle.onChange((isOn: boolean) => {
        v.onSwitch(isOn)
      })
    }

    if (v.onTintColor) {
      Toggle.selectedColor(v.onTintColor.toModel())
    }

    if (v.thumbTintColor) {
      Toggle.switchPointColor(v.thumbTintColor.toModel())
    }

    // commonConfig
    this.commonConfig(v)
  }
}
