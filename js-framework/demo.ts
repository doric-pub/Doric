import { NativeCall, Text, Alignment, Color, VLayout, Panel, log, logw, loge } from "./index"
import { Group } from "./src/ui/view";



@Entry
export class MyPage extends Panel {
    text?: Text
    build(rootView: Group): void {
        this.text = new Text
        this.text.text = "hello"
        this.text.width = 50
        this.text.height = 50
        this.text.y = 100
        rootView.children.push(this.text)
        rootView.bgColor = Color.safeParse('#00ff00')
        log('build view:', JSON.stringify(rootView.toModel()))
    }

    @NativeCall
    log() {
        log("Hello.HEGO")
        logw("Hello.HEGO")
        loge("Hello.HEGO")

        context.demo.testPromise(true).then((r) => {
            log('resolve', r)
        }, (e) => {
            log('reject', e)
        })

        context.demo.testPromise(false).then((r) => {
            log('resolve', r)
        }, (e) => {
            log('reject', e)
        })

        setTimeout(function () {
            log('settimeout')
        }, 1000)

        setInterval(() => {
            log('setInterval')
            if (this.text) {
                this.text.y += 10
            }
            log('build view:', JSON.stringify(this.getRootView().toModel()))
        }, 1000)
    }
}