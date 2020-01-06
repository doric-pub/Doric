import { text, loge, log, ViewHolder, Stack, ViewModel, Gravity, Text, Color, Group, VMPanel, LayoutSpec, vlayout, hlayout, takeNonNull } from "doric";

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

    panel!: Stack
    start?: Text
    up?: Text
    down?: Text
    left?: Text
    right?: Text

    build(root: Group): void {
        root.backgroundColor = Color.parse('#000000')
        vlayout([
            text({
                text: "Snake",
                textSize: 20,
                textColor: Color.parse("#ffffff"),
                layoutConfig: {
                    alignment: new Gravity().centerX(),
                    margin: {
                        top: 20
                    },
                    widthSpec: LayoutSpec.FIT,
                    heightSpec: LayoutSpec.FIT,
                },
            }),
            (new Stack).also(panel => {
                panel.backgroundColor = Color.parse('#00ff00')
                this.panel = panel
            }),
            hlayout([
                text({
                    text: "Start",
                    textSize: 30,
                    textColor: Color.parse("#ffffff"),
                    layoutConfig: {
                        widthSpec: LayoutSpec.FIT,
                        heightSpec: LayoutSpec.FIT,
                    },
                }).also(it => this.start = it),
            ]).also(it => {
                it.layoutConfig = {
                    widthSpec: LayoutSpec.FIT,
                    heightSpec: LayoutSpec.FIT,
                }
            }),

            vlayout([
                hlayout([
                    text({
                        width: 50,
                        height: 50,
                        text: "↑",
                        textSize: 30,
                        textAlignment: new Gravity().center(),
                        backgroundColor: Color.parse('#ffff00'),
                        layoutConfig: {
                            widthSpec: LayoutSpec.JUST,
                            heightSpec: LayoutSpec.JUST,
                        },
                    }).also(it => this.up = it)
                ]).also(it => {
                    it.layoutConfig = {
                        widthSpec: LayoutSpec.FIT,
                        heightSpec: LayoutSpec.FIT,
                    }
                }),
                hlayout([
                    text({
                        width: 50,
                        height: 50,
                        text: "←",
                        textSize: 30,
                        textAlignment: new Gravity().center(),
                        backgroundColor: Color.parse('#ffff00'),
                        layoutConfig: {
                            widthSpec: LayoutSpec.JUST,
                            heightSpec: LayoutSpec.JUST,
                        },
                    }).also(it => this.left = it),
                    text({
                        width: 50,
                        height: 50,
                        text: "↓",
                        textSize: 30,
                        textAlignment: new Gravity().center(),
                        backgroundColor: Color.parse('#ffff00'),
                        layoutConfig: {
                            widthSpec: LayoutSpec.JUST,
                            heightSpec: LayoutSpec.JUST,
                        },
                    }).also(it => this.down = it),
                    text({
                        width: 50,
                        height: 50,
                        text: "→",
                        textSize: 30,
                        textAlignment: new Gravity().center(),
                        backgroundColor: Color.parse('#ffff00'),
                        layoutConfig: {
                            widthSpec: LayoutSpec.JUST,
                            heightSpec: LayoutSpec.JUST,
                        },
                    }).also(it => this.right = it),
                ]).also(it => {
                    it.layoutConfig = {
                        widthSpec: LayoutSpec.FIT,
                        heightSpec: LayoutSpec.FIT,
                    }
                    it.space = 10
                }),
            ]).also(controlArea => {
                controlArea.gravity = new Gravity().centerX()
                controlArea.space = 10
                controlArea.layoutConfig = {
                    alignment: new Gravity().centerX(),
                    widthSpec: LayoutSpec.FIT,
                    heightSpec: LayoutSpec.FIT,
                }
            }),
        ]).also(it => {
            it.space = 20
            it.layoutConfig = {
                alignment: new Gravity().centerX().top(),
                widthSpec: LayoutSpec.MOST,
                heightSpec: LayoutSpec.MOST,
            }
            it.gravity = new Gravity().centerX()
        }).in(root)
    }

    bind(state: SnakeModel): void {
        log('build', state)
        this.panel.width = state.width * 10
        this.panel.height = state.height * 10
        let node: SnakeNode | undefined = state.head
        let nodes: SnakeNode[] = []
        while (node != undefined) {
            nodes.push(node)
            node = node.next
        }
        nodes.push(state.food)
        nodes.forEach((e, index) => {

            let item = this.panel.children[index]
            if (item === undefined) {
                item = new Stack
                item.width = item.height = 10
                item.corners = 5
                item.shadow = {
                    color: Color.GRAY,
                    opacity: 1,
                    radius: 3,
                    offsetX: 3,
                    offsetY: 3,
                }
                this.panel.addChild(item)
            }
            if (index === nodes.length - 1) {
                item.backgroundColor = Color.parse('#ffff00')
            } else {
                item.backgroundColor = Color.parse('#ff0000')
            }
            item.x = e.x * 10
            item.y = e.y * 10
        })

        if (nodes.length < this.panel.children.length) {
            this.panel.children.length = nodes.length
        }
    }
}

class SnakeVM extends ViewModel<SnakeModel, SnakeView>{
    timerId?: any

    start = () => {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
        }
        this.updateState(it => it.reset())
        this.timerId = setInterval(() => {
            this.updateState(it => it.step())
            if (this.getState().state === State.fail) {
                loge('Game Over')
                this.stop()
            }
        }, 500)
    }

    stop = () => {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
            this.timerId = undefined
        }
    }

    left = () => {
        this.updateState(it => it.direction = Direction.left)
    }

    right = () => {
        this.updateState(it => it.direction = Direction.right)
    }

    up = () => {
        this.updateState(it => it.direction = Direction.up)
    }

    down = () => {
        this.updateState(it => it.direction = Direction.down)
    }

    onAttached(state: SnakeModel, v: SnakeView) {
        takeNonNull(v.start)(it => it.onClick = this.start)
        takeNonNull(v.left)(it => it.onClick = this.left)
        takeNonNull(v.right)(it => it.onClick = this.right)
        takeNonNull(v.up)(it => it.onClick = this.up)
        takeNonNull(v.down)(it => it.onClick = this.down)
    }
    onBind(state: SnakeModel, v: SnakeView) {
        v.bind(state)
    }
}
@Entry
class SnakePanel extends VMPanel<SnakeModel, SnakeView>{
    getViewModelClass() {
        return SnakeVM
    }
    getState(): SnakeModel {
        return new SnakeModel(35, 35)
    }
    getViewHolderClass() {
        return SnakeView
    }
}