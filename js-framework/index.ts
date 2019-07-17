import { Text, Alignment, VLayout, Gravity } from "./src/ui/view";
import { Color } from "./src/util/color";
import { Page, Registor } from "./src/ui/page";

export * from "./src/ui/view"
export * from "./src/ui/page"
export * from "./src/util/color"


const v = new Text
v.width = 20
v.height = 30
v.left = 5
v.top = 5
v.bgColor = Color.parse('#00ff00')
v.config = {
    alignment: Alignment.start
}
console.log(v.toModel())

const layout = new VLayout
layout.space = 10
console.log(layout.toModel())

@Registor
class MyPage extends Page {
    build(): import("./src/ui/view").View {
        throw new Error("Method not implemented.");
    }
}
console.log('end')