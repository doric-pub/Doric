import { loge, log, ViewHolder, Stack, ViewModel, Gravity, Text, Color, HLayout, VLayout, Group, VMPanel } from "doric";

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
            loge('out of bound')
            this.state = State.fail
        } else if (this.head.x == this.food.x && this.head.y == this.food.y) {
            //If eat food

            let head: SnakeNode = { x: this.food.x, y: this.food.y }
            log('eat food', head)
            this.forward(head)
            this.head.prev = head
            head.next = this.head
            this.head = head
            this.refreshFood()
        }
        if (this.crashAtSelf()) {
            //If crash at self
            loge('crash at self')
            this.state = State.fail
        }
    }

    crashAtSelf() {
        let cur = this.head.next
        while (cur !== undefined) {
            if (cur.x == this.head.x && cur.y == this.head.y) {
                return true
            }
            cur = cur.next
        }
        return false
    }

    reset() {
        this.direction = Direction.right
        this.state = State.run
        this.head.x = 0
        this.head.y = 0
        this.head.next = undefined
        this.refreshFood()
    }
}

class SnakeView extends ViewHolder {
    panel: Stack = new Stack
    start: Text = new Text
    up?: Text
    down?: Text
    left?: Text
    right?: Text

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
        vlayout.space = 20
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


        this.up = this.buildController("↑")
        this.down = this.buildController("↓")
        this.left = this.buildController("←")
        this.right = this.buildController("→")

        const controlArea = new VLayout
        controlArea.gravity = new Gravity().centerX()
        controlArea.space = 10
        controlArea.layoutConfig = {
            alignment: new Gravity().centerX()
        }
        const line1 = new HLayout
        const line2 = new HLayout
        line2.space = 10
        line1.addChild(this.up)
        line2.addChild(this.left)
        line2.addChild(this.down)
        line2.addChild(this.right)
        controlArea.addChild(line1)
        controlArea.addChild(line2)
        vlayout.addChild(controlArea)
    }

    buildController(text: string) {
        const ret = new Text
        ret.width = ret.height = 50
        ret.bgColor = Color.parse('#ffff00')
        ret.text = text
        ret.textSize = 30
        ret.textAlignment = new Gravity().center()
        return ret
    }
}

class SnakeVM extends ViewModel<SnakeModel, SnakeView>{

    timerId?: any

    start = () => {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
        }
        this.getModel().reset()
        this.timerId = setInterval(() => {
            this.getModel().step()
        }, 500)
    }

    stop = () => {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
            this.timerId = undefined
        }
    }

    left = () => {
        this.getModel().direction = Direction.left
    }

    right = () => {
        this.getModel().direction = Direction.right
    }

    up = () => {
        this.getModel().direction = Direction.up
    }

    down = () => {
        this.getModel().direction = Direction.down
    }

    binding(v: SnakeView, model: SnakeModel) {
        if (model.state === State.fail) {
            loge('Game Over')
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
        })

        if (nodes.length < v.panel.children.length) {
            v.panel.children.length = nodes.length
        }
        if (v.left) {
            v.left.onClick = this.left
        }
        if (v.right) {
            v.right.onClick = this.right
        }
        if (v.up) {
            v.up.onClick = this.up
        }
        if (v.down) {
            v.down.onClick = this.down
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