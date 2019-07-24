import { VMPanel, View, ViewModel, WRAP_CONTENT, Gravity, Mutable, NativeCall, Text, Color, VLayout, Panel, log, logw, loge, Group, Stack, } from "./index"
interface CountModel {
    count: number
    add: () => void
}

class CounterVM extends ViewModel<CountModel> {
    build(root: Group, model: CountModel) {
        const vlayout = new VLayout
        const number = new Text
        number.textSize = 40
        number.layoutConfig = {
            alignment: new Gravity().center()
        }
        const counter = new Text
        counter.text = "点击计数"
        counter.textSize = 20

        vlayout.space = 20
        vlayout.layoutConfig = {
            alignment: new Gravity().center()
        }
        vlayout.addChild(number)
        vlayout.addChild(counter)

        root.addChild(vlayout)

        this.bind((data) => {
            loge('bind:', data)
            number.text = data.count.toString()
            counter.onClick = data.add
        })

    }
}


@Entry
class MyPage extends VMPanel<CountModel>{

    createVM(): ViewModel<CountModel> {
        return new CounterVM({
            count: 0,
            add: function () {
                this.count++
            }
        })
    }

    @NativeCall
    log() {
        log("Hello.HEGO")
        logw("Hello.HEGO")
        loge("Hello.HEGO")
    }
}