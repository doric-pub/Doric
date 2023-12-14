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
import { SnakePanel } from '../panel/Snake';
import { Gobang } from '../panel/Gobang';
import { ListDragDemo } from '../panel/ListDragDemo';
import { ListPanel } from '../panel/ListDemo';
import { ModalDemo } from '../panel/ModalDemo';
import { SliderPanel } from '../panel/SliderDemo';
import { CounterPage } from '../panel/Counter';
import { FlowLayoutDemo } from '../panel/FlowLayoutDemo';
import { HorizontalListPanel } from '../panel/HorizontalListDemo';
import { NetworkDemo } from '../panel/NetworkDemo';

@Entry
@Component
struct Demo {
  private index: number = (router.getParams() as any).index;
  private classMap = [
    ComponentDemo,
    CounterPage,
    EffectsDemo,
    FlexDemo,
    FlowLayoutDemo,
    Gobang,
    HelloDoric,
    HorizontalListPanel,
    ImageDemo,
    InputDemo,
    LayoutDemo,
    ListPanel,
    ListDragDemo,
    ModalDemo,
    NetworkDemo,
    ScrollerDemo,
    SliderPanel,
    SnakePanel,
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