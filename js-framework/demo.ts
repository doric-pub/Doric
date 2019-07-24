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

enum Direction {
    left = 0,
    right = 1,
    up = 2,
    down = 3,
}

interface SnakeNode {
    prev?: SnakeNode
    next?: SnakeNode
    x: number
    y: number
}

enum State {
    idel,
    run,
    fail,
}

class SnakeModel {
    state = State.idel
    direction = Direction.left
    width = 10
    height = 10

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

class SnakeVM extends ViewModel<SnakeModel, SnakeView>{
    binding(v: SnakeView, model: SnakeModel) {

    }
}

@Entry
class SnakePanel extends VMPanel<SnakeModel, SnakeView>{
    getVMClass() {
        return SnakeVM
    }
    getModel() {
        return new SnakeModel
    }

    getViewHolder() {
        return new SnakeView
    }
}