import { Text } from "./view/view";
import { Color } from "./util/color";

const v = new Text
v.width = 20
v.height = 30
v.left = 5
v.top = 5
v.bgColor = Color.parse('#00ff00')
console.log(v.toModel())
