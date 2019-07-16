import { Text, Alignment, VLayout, Gravity } from "./view/view";
import { Color } from "./util/color";

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

const layout = new Text

console.log(layout.toModel())
