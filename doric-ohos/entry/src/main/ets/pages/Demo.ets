import router from '@ohos.router';

import { ContainerPage } from '@doric/ohos'
import { HelloDoric } from '../panel/HelloDoric';
import { LayoutDemo } from '../panel/LayoutDemo';
import { ScrollerDemo } from '../panel/ScrollerDemo';
import { EffectsDemo } from '../panel/EffectsDemo';
import { ImageDemo } from '../panel/ImageDemo';
import { TextDemo } from '../panel/TextDemo';
import { InputDemo } from '../panel/InputDemo';
import { SwitchDemo } from '../panel/SwitchDemo';
import { ComponentDemo } from '../panel/ComponentDemo';
import { FlexDemo } from '../panel/FlexDemo';

@Entry
@Component
struct Demo {
  private index: number = (router.getParams() as any).index;
  private classMap = [
    ComponentDemo,
    EffectsDemo,
    FlexDemo,
    HelloDoric,
    ImageDemo,
    InputDemo,
    LayoutDemo,
    ScrollerDemo,
    SwitchDemo,
    TextDemo
  ]

  build() {
    Column() {
      ContainerPage({ clz: this.classMap[this.index] })
    }
    .width('100%')
    .height(`100%`)
    .backgroundColor(Color.White)
  }

  updateDirtyElements() {
    console.log("updateDirtyElements")
    // @ts-ignore
    super.updateDirtyElements()
  }
}