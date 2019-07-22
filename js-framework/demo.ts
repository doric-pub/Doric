import { NativeCall, Text, Alignment, Color, VLayout, Panel, log, logw, loge } from "./index"
import { Group } from "./src/ui/view";



@Entry
export class MyPage extends Panel {

    build(rootView: Group): void {
        log('build view')
        const text = new Text
        text.text = "hello"
        rootView.children.push(text)
    }

    @NativeCall
    log() {
        log("Hello.HEGO")
        logw("Hello.HEGO")
        loge("Hello.HEGO")
        context.bridge.demo_testPromise(true).then((r) => {
            log('resolve', r)
        }, (e) => {
            log('reject', e)
        })
        context.bridge.demo_testPromise(false).then((r) => {
            log('resolve', r)
        }, (e) => {
            log('reject', e)
        })
        setTimeout(function () {
            log('settimeout')
        }, 1000)
    }
}