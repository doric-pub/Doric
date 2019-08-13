import { Image, ViewHolder, VMPanel, ViewModel, Gravity, NativeCall, Text, Color, VLayout, log, logw, loge, Group, } from "doric"


interface CountModel {
    count: number
}

class CounterView extends ViewHolder {
    number = new Text
    counter = new Text
    build(root: Group) {
        const vlayout = new VLayout
        vlayout.width = 200
        vlayout.height = 200
        vlayout.gravity = new Gravity().center()
        this.number.textSize = 40
        this.number.layoutConfig = {
            alignment: new Gravity().center()
        }
        this.counter = new Text
        this.counter.text = "点击计数"
        this.counter.border = {
            width: 1,
            color: Color.parse('#000000'),
        }
        this.counter.textSize = 20
        this.counter.corners = 5
        vlayout.space = 20
        vlayout.layoutConfig = {
            alignment: new Gravity().center()
        }
        vlayout.border = {
            width: 1,
            color: Color.parse("#000000"),
        }
        this.counter.shadow = {
            color: Color.parse("#00ff00"),
            opacity: 0.5,
            radius: 20,
            offsetX: 10,
            offsetY: 10,
        }
        vlayout.shadow = {
            color: Color.parse("#ffff00"),
            opacity: 0.5,
            radius: 20,
            offsetX: 10,
            offsetY: 10,
        }
        vlayout.corners = 20
        vlayout.addChild(this.number)
        vlayout.addChild(this.counter)
        // root.bgColor = Color.parse('#00ff00')
        vlayout.bgColor = Color.parse('#ff00ff')
        root.addChild(vlayout)
        const iv = new Image
        // iv.width = iv.height = 100
        iv.imageUrl = "https://misc.aotu.io/ONE-SUNDAY/SteamEngine.png"
        //iv.bgColor = Color.parse('#00ff00')
        root.addChild(iv)
    }

    setNumber(n: number) {
        this.number.text = n.toString()
    }

    setCounter(v: Function) {
        this.counter.onClick = v
    }
}

class CounterVM extends ViewModel<CountModel, CounterView> {

    binding(v: CounterView, model: CountModel): void {
        v.setNumber(model.count)
        v.setCounter(() => {
            this.getModel().count++
        })
    }
}

@Entry
class MyPage extends VMPanel<CountModel, CounterView>{

    getVMClass() {
        return CounterVM
    }

    getModel() {
        return {
            count: 0,
            add: function () {
                this.count++
            },
        }
    }

    getViewHolder() {
        return new CounterView
    }


    @NativeCall
    log() {
        log("Hello.HEGO")
        logw("Hello.HEGO")
        loge("Hello.HEGO")
        context.modal.toast('This is a toast.').then((r) => {
            loge(r)
        })
    }
}