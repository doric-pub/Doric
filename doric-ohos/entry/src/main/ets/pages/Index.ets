import {ContainerPage} from "@doric/ohos"
import { HelloDoric } from '../panel/HelloDoric';
import { LayoutDemo } from '../panel/LayoutDemo';
import { ScrollerDemo } from '../panel/ScrollerDemo';

@Entry
@Component
struct CounterPage {
  @State countData: {
    counted:number
  } = {counted:0};

  build() {
    Column() {
      // ContainerPage({clz: HelloDoric })
      ContainerPage({clz: LayoutDemo })
      // ContainerPage({clz: ScrollerDemo })
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