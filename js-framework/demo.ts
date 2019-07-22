import { NativeCall, Text, Alignment, Color, VLayout, Panel, log, logw, loge } from "./index"
import { Group } from "./src/ui/view";



@Entry
export class MyPage extends Panel {

    build(rootView: Group): void {
        log('build view')
        const text = new Text
        text.text = "hello"
        rootView.children.push(text)
        rootView.bgColor = Color.safeParse('#00ff00')
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
    }
}