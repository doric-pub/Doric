import { Text, Alignment, VLayout, Gravity } from "./src/ui/view";
import { Color } from "./src/util/color";

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
export * from "./src/ui/view"
export * from "./src/ui/page"
export * from "./src/util/color"
