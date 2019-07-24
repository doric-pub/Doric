import { StackConfig, ViewHolder, VMPanel, View, ViewModel, WRAP_CONTENT, Gravity, Mutable, NativeCall, Text, Color, VLayout, Panel, log, logw, loge, Group, Stack, } from "./index"

interface CountModel {
    count: number
}

class CounterView extends ViewHolder {
    number = new Text
    counter = new Text
    build(root: Group) {
        const vlayout = new VLayout
        this.number.textSize = 40
        this.number.layoutConfig = {
            alignment: new Gravity().center()
        }
        this.counter = new Text
        this.counter.text = "点击计数"
        this.counter.textSize = 20

        vlayout.space = 20
        vlayout.layoutConfig = {
            alignment: new Gravity().center()
        }
        vlayout.addChild(this.number)
        vlayout.addChild(this.counter)

        root.addChild(vlayout)
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
    }
}


type Postion = { x: number, y: number }

enum Location {
    left = 0,
    right = 1,
    top = 2,
    bottom = 3,
}

class Snake {
    direction: "left" | "right" | "top" | "bottom" = "right"
    length: number = 1
    width: number = 1
    height: number = 1

    head: Postion = { x: 1, y: 0 }
    body: Location[] = []

    crash() {

    }

    step() {
        switch (this.direction) {
            case "left":
                const head = this.body[0]
                if (head.x - 1 < 0) {
                    this.crash()
                }
                head.x -= 1
                this.body.reduce((pre, cur) => {

                    return cur
                })
                break
            case "right":
                break
            case "top":
                break
            case "bottom":
                break
        }
    }


}

class SnakeView extends ViewHolder {

    build(root: Group): void {
        root.bgColor = Color.parse('#000000')
        const title = new Text
        title.text = "Snake"
        title.textSize = 20
        title.textColor = Color.parse("#ffffff")
        title.layoutConfig = {
            alignment: new Gravity().centerX().top(),
            margin: {
                top: 20
            }
        } as StackConfig
        root.addChild(title)
    }
}

class SnakeVM extends ViewModel<Snake, SnakeView>{
    binding(v: SnakeView, model: Snake) {

    }
}

@Entry
class SnakePanel extends VMPanel<Snake, SnakeView>{
    getVMClass() {
        return SnakeVM
    }
    getModel() {
        return new Snake
    }

    getViewHolder() {
        return new SnakeView
    }
}