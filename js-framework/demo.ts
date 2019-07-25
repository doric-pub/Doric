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


enum State {
    idel,
    run,
    fail,
}

class SnakeModel {
    state = State.idel
    direction = Direction.left

    width: number
    height: number

    constructor(w: number, h: number) {
        this.width = w
        this.height = h
    }
    food = { x: 0, y: 0 }

    head: SnakeNode = {
        x: 0,
        y: 0,
    }

    refreshFood() {
        this.food.x = Math.floor(Math.random() * (this.width - 1))
        this.food.y = Math.floor(Math.random() * (this.height - 1))
    }

    get tail() {
        let node = this.head
        while (node.next !== undefined) {
            node = node.next
        }
        return node
    }
    get score() {
        let node = this.head
        let n = 0
        while (node.next !== undefined) {
            n++
            node = node.next
        }
        return n
    }

    forward(node: SnakeNode) {
        switch (this.direction) {
            case Direction.left:
                node.x -= 10
                break;
            case Direction.right:
                node.x += 10
                break;
            case Direction.up:
                node.y -= 10
                break;
            case Direction.down:
                node.y += 10
                break;
        }
    }


    step() {
        if (this.state !== State.run) {
            return
        }
        let tail = this.tail
        while (tail.prev != undefined) {
            tail.x = tail.prev.x
            tail.y = tail.prev.y
            tail = tail.prev
        }
        this.forward(this.head)
        if (this.head.x < 0 || this.head.x >= this.width
            || this.head.y < 0 || this.head.y >= this.height) {
            //If out of bound
            this.state = State.fail
        } else if (this.head.x == this.food.x && this.head.y == this.food.y) {
            //If eat food
            let head = { x: this.food.x, y: this.food.y, next: this.head }
            this.head.prev = head
            this.forward(head)
            this.head = head
            this.refreshFood()
        }
        if (this.crashAtSelf()) {
            //If crash at self
            this.state = State.fail
        }
    }

    crashAtSelf() {
        let cur = this.head.next
        while (cur) {
            if (cur.x == this.head.x && cur.y == this.head.y) {
                return true
            }
            cur = cur.next
        }
        return false
    }
}

class SnakeView extends ViewHolder {
    panel: Stack = new Stack

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
        root.addChild(this.panel)
        root.addChild(title)
    }
}

class SnakeVM extends ViewModel<SnakeModel, SnakeView>{
    timerId?: any

    start() {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
        }
        this.timerId = setInterval(() => {
            this.getModel().step()
        }, 1000)
    }

    stop() {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
            this.timerId = undefined
        }
    }

    binding(v: SnakeView, model: SnakeModel) {
        v.panel.width = model.width * 10
        v.panel.height = model.height * 10
        let node: SnakeNode | undefined = model.head
        let nodes: SnakeNode[] = []
        while (node != undefined) {
            nodes.push(node)
            node = node.next
        }
        nodes.forEach((e, index) => {
            let item = v.panel.children[index]
            if (item) {
                item.x = e.x * 10
                item.height = e.y * 10
            } else {
                item = new Stack
                item.bgColor = Color.parse('#0000ff')
                item.width = item.height = 10
                v.panel.addChild(item)
            }
        })
        if (nodes.length < v.panel.children.length) {
            v.panel.children.length = nodes.length
        }
    }
}

@Entry
class SnakePanel extends VMPanel<SnakeModel, SnakeView>{

    getVMClass() {
        return SnakeVM
    }

    getModel() {
        return new SnakeModel(this.getRootView().width / 10, this.getRootView().width / 10)
    }

    getViewHolder() {
        return new SnakeView
    }
}