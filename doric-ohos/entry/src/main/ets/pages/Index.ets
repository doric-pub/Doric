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

@Entry
@Component
struct CounterPage {
  @State countData: {
    counted: number
  } = { counted: 0 };

  build() {
    Column() {
      ContainerPage({ clz: ComponentDemo })
      // ContainerPage({ clz: EffectsDemo })
      // ContainerPage({ clz: HelloDoric })
      // ContainerPage({ clz: ImageDemo })
      // ContainerPage({ clz: InputDemo })
      // ContainerPage({ clz: LayoutDemo })
      // ContainerPage({ clz: ScrollerDemo })
      // ContainerPage({ clz: SwitchDemo })
      // ContainerPage({ clz: TextDemo })
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