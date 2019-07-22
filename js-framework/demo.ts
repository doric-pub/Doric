import { Text, Alignment, Color, VLayout, Panel, log, logw, loge } from "./index"
import { NativeCall } from "./src/ui/panel";



@Entry
export class MyPage extends Panel {
    build() {
        return new Text
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