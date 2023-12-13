import router from '@ohos.router';

@Entry
@Component
struct Index {
  @State demo: Array<String> = [
    "ComponentDemo",
    "Counter",
    "EffectsDemo",
    "FlexDemo",
    "Gobang",
    "HelloDoric",
    "ImageDemo",
    "InputDemo",
    "LayoutDemo",
    "ListDemo",
    "ListDragDemo",
    "ModalDemo",
    "ScrollerDemo",
    "SliderDemo",
    "Snake",
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