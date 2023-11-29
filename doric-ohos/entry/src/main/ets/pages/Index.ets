import {ContainerPage} from "@doric/ohos"

@Entry
@Component
struct CounterPage {
  @State countData: {
    counted:number
  } = {counted:0};

  build() {
    Column() {
      ContainerPage()
      // Text(`Counter ${this.countData.counted}`)
      //   .fontSize(16)
      //   .fontColor(Color.Black)
      //   .fontWeight(500)
      //   .align(Alignment.Center)
      // Text('Click to count')
      //   .fontSize("20fp")
      //   .fontColor("#FFFFFF")
      //   .fontWeight(500)
      //   .align(Alignment.Center)
      //   .margin({
      //     top:20
      //   })
      //   .padding({
      //     left:20,right:20,top:20,bottom:20
      //   })
      //   .backgroundColor("#3498db")
      //   .onClick(()=>{
      //     console.log("click1")
      //     console.log("panel", a)
      //     this.countData.counted++;
      //   })
    }
    .width('100%')
    .height(`100%`)
    .backgroundColor(Color.White)
  }


  updateDirtyElements(){
    console.log("updateDirtyElements")
    // @ts-ignore
    super.updateDirtyElements()
  }
}