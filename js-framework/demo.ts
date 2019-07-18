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
log('console', Object.getOwnPropertyNames(console))

setTimeout(() => {
    log('exec setTimeout')
}, 1000)
const timerId = setInterval(() => {
    log('exec setInterval')
}, 1000)

setTimeout(() => {
    log('exec cancelTimer')
    clearInterval(timerId)
}, 5000)

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