import { DoricViewController } from 'doric'

@Entry
@Component
struct Index {
  @State flag: boolean = false

  aboutToAppear(): void {
    setTimeout(() => {
      this.flag = true
    }, 3000)
  }

  build() {
    Column() {
      // Use DoricViewController to load and display a Doric JS panel
      // Aligned with iOS usage: [[DoricViewController alloc] initWithSource:alias:extra:]
      if (this.flag) {
        DoricViewController({
          source: 'Counter',
          alias: 'Counter',
          extra: ''
        })
      }
    }
    .width('100%')
    .height('100%')
  }
}
