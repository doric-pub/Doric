import router from '@ohos.router';

@Entry
@Component
struct Index {
  @State demo: Array<String> = [
    "AnimationsDemo",
    "AnimatorDemo",
    "ComplicatedAnimations",
    "ComponentDemo",
    "Counter",
    "EffectsDemo",
    "FlexDemo",
    "FlowLayoutDemo",
    "Gobang",
    "HelloDoric",
    "HorizontalListDemo",
    "HorizontalListInListDemo",
    "ImageDemo",
    "InputDemo",
    "LayoutDemo",
    "ListDemo",
    "ListDragDemo",
    "ModalDemo",
    "NetworkDemo",
    "NotchDemo",
    "RefreshableDemo",
    "ScrollerDemo",
    "ScrollerInListDemo",
    "SliderDemo",
    "Snake",
    "StickDemo",
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
          }).fontSize(25)
        }, (item: any, index?: number) => {
          return index.toString()
        })
      }.width('100%')
    }
    .width('100%')
    .height(`100%`)
    .backgroundColor(Color.White)
    .align(Alignment.TopStart)
  }
}