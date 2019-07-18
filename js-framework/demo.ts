import { Text, Alignment, Color, VLayout, Registor, Panel, log, logw, loge } from "./index"

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
console.log(layout.viewId)
console.log(layout.toModel())

@Registor(context)
export class MyPage extends Panel {
    build() {
        return layout
    }
    log() {
        log("Hello.HEGO")
        logw("Hello.HEGO")
        loge("Hello.HEGO")
    }
}