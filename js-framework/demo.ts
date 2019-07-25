import { HLayout, StackConfig, ViewHolder, VMPanel, View, ViewModel, WRAP_CONTENT, Gravity, Mutable, NativeCall, Text, Color, VLayout, Panel, log, logw, loge, Group, Stack, } from "./index"


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
type SnakeNode = {
    x: number
    y: number
    prev?: SnakeNode
    next?: SnakeNode
}


enum Direction {
    left = 0,
    right = 1,
    up = 2,
    down = 3,
}

enum State {
    idel,
    run,
    fail,
}

class SnakeModel {
    state = State.idel
    direction = Direction.right

    width: number
    height: number

    constructor(w: number, h: number) {
        this.width = w
        this.height = h
    }
    food = { x: -1, y: -1 }

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
        loge('forward', node)
        switch (this.direction) {
            case Direction.left:
                node.x -= 1
                break;
            case Direction.right:
                node.x += 1
                break;
            case Direction.up:
                node.y -= 1
                break;
            case Direction.down:
                node.y += 1
                break;
        }
        loge('forward', node)
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
    start: Text = new Text
    build(root: Group): void {
        root.bgColor = Color.parse('#000000')
        const vlayout = new VLayout
        const title = new Text
        title.text = "Snake"
        title.textSize = 20
        title.textColor = Color.parse("#ffffff")
        title.layoutConfig = {
            alignment: new Gravity().centerX(),
            margin: {
                top: 20
            },
        }
        vlayout.layoutConfig = {
            alignment: new Gravity().centerX().top()
        }
        this.panel.bgColor = Color.parse('#00ff00')
        vlayout.addChild(title)
        vlayout.addChild(this.panel)
        root.addChild(vlayout)

        const hlayout = new HLayout
        this.start.text = "Start"
        this.start.textSize = 30
        this.start.textColor = Color.parse("#ffffff")

        hlayout.addChild(this.start)
        vlayout.addChild(hlayout)
    }
}

class SnakeVM extends ViewModel<SnakeModel, SnakeView>{

    timerId?: any

    start = () => {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
        }
        this.getModel().state = State.run
        this.getModel().head.x = 0
        this.getModel().head.y = 0
        this.getModel().head.next = undefined
        this.getModel().refreshFood()
        this.timerId = setInterval(() => {
            this.getModel().step()
        }, 1000)
    }

    stop = () => {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
            this.timerId = undefined
        }
    }

    binding(v: SnakeView, model: SnakeModel) {
        if (model.state === State.fail) {
            this.stop()
        }
        v.start.onClick = this.start
        v.panel.width = model.width * 10
        v.panel.height = model.height * 10
        let node: SnakeNode | undefined = model.head
        let nodes: SnakeNode[] = []
        while (node != undefined) {
            nodes.push(node)
            node = node.next
        }
        nodes.push(model.food)
        nodes.forEach((e, index) => {

            let item = v.panel.children[index]
            if (item === undefined) {
                item = new Stack
                item.width = item.height = 10
                v.panel.addChild(item)
            }
            if (index === nodes.length - 1) {
                item.bgColor = Color.parse('#ffff00')
            } else {
                item.bgColor = Color.parse('#ff0000')
            }
            item.x = e.x * 10
            item.y = e.y * 10
            loge('render', v.panel.toModel())
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
        return new SnakeModel(35, 35)
    }

    getViewHolder() {
        return new SnakeView
    }
}