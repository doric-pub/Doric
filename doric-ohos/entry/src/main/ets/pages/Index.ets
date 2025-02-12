import { init } from 'doric';

@Entry
@Component
struct Index {
  @State message: string = 'Hello World'

  build() {
    RelativeContainer() {
      Text(this.message)
        .id('HelloWorld')
        .fontSize($r('app.float.page_text_font_size'))
        .fontWeight(FontWeight.Bold)
        .alignRules({
          center: { anchor: '__container__', align: VerticalAlign.Center },
          middle: { anchor: '__container__', align: HorizontalAlign.Center }
        })
        .onClick(() => {
          init()
        })
    }
    .height('100%')
    .width('100%')
  }
}