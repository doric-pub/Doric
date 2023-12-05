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
import router from '@ohos.router';

@Entry
@Component
struct Index {
  @State demo: Array<String> = [
    "ComponentDemo",
    "EffectsDemo",
    "FlexDemo",
    "HelloDoric",
    "ImageDemo",
    "InputDemo",
    "LayoutDemo",
    "ScrollerDemo",
    "SwitchDemo",
    "TextDemo"
  ]

  build() {
    Scroll() {
      Column({ space: 10 }) {
        ForEach(this.demo, (item: any, index?: number) => {
          Text(item).onClick(() => {
            router.pushUrl({
              url: "pages/Demo",
              params: {
                index: index
              }
            })
          })
        }, (item: any, index?: number) => {
          return index.toString()
        })
      }.width('100%')
    }
    .width('100%')
    .height(`100%`)
    .backgroundColor(Color.White)
  }
}