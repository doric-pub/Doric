import { loge, log, ViewHolder, Stack, ViewModel, Gravity, Text, Color, HLayout, VLayout, Group, VMPanel, LayoutSpec, vlayout, hlayout } from "doric";

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

class SnakeView extends ViewHolder<SnakeModel> {

    panel: Stack = new Stack
    start: Text = new Text
    up?: Text
    down?: Text
    left?: Text
    right?: Text

    build(root: Group): void {
        root.bgColor = Color.parse('#000000')
        vlayout([
            () => {
                return (new Text).also(title => {
                    title.text = "Snake"
                    title.textSize = 20
                    title.textColor = Color.parse("#ffffff")
                    title.layoutConfig = {
                        alignment: new Gravity().centerX(),
                        margin: {
                            top: 20
                        },
                        widthSpec: LayoutSpec.WRAP_CONTENT,
                        heightSpec: LayoutSpec.WRAP_CONTENT,
                    }
                })
            },
            () => {
                return (new Stack).also(panel => {
                    panel.bgColor = Color.parse('#00ff00')

                })
            },
            () => {
                return hlayout([
                    () => {
                        return (new Text).also(it => {
                            it.text = "Start"
                            it.textSize = 30
                            it.textColor = Color.parse("#ffffff")
                            it.layoutConfig = {
                                widthSpec: LayoutSpec.WRAP_CONTENT,
                                heightSpec: LayoutSpec.WRAP_CONTENT,
                            }
                            this.start = it
                        })
                    },
                ]).also(it => {
                    it.layoutConfig = {
                        widthSpec: LayoutSpec.WRAP_CONTENT,
                        heightSpec: LayoutSpec.WRAP_CONTENT,
                    }
                })
            },
            () => {
                return vlayout([
                    () => {
                        return hlayout([
                            () => {
                                return this.buildController("↑").also(it => {
                                    this.up = it
                                })
                            }
                        ]).also(it => {
                            it.layoutConfig = {
                                widthSpec: LayoutSpec.WRAP_CONTENT,
                                heightSpec: LayoutSpec.WRAP_CONTENT,
                            }
                        })
                    },
                    () => {
                        return hlayout([
                            () => {
                                return this.buildController("←").also(it => {
                                    this.left = it
                                })
                            },
                            () => {
                                return this.buildController("↓").also(it => {
                                    this.down = it
                                })
                            },
                            () => {
                                return this.buildController("→").also(it => {
                                    this.right = it
                                })
                            },
                        ]).also(it => {
                            it.layoutConfig = {
                                widthSpec: LayoutSpec.WRAP_CONTENT,
                                heightSpec: LayoutSpec.WRAP_CONTENT,
                            }
                            it.space = 10
                        })
                    },
                ])
                    .also(controlArea => {
                        controlArea.gravity = new Gravity().centerX()
                        controlArea.space = 10
                        controlArea.layoutConfig = {
                            alignment: new Gravity().centerX(),
                            widthSpec: LayoutSpec.WRAP_CONTENT,
                            heightSpec: LayoutSpec.WRAP_CONTENT,
                        }
                    })
            }
        ]).also(it => {
            it.space = 20
            it.layoutConfig = {
                alignment: new Gravity().centerX().top(),
                widthSpec: LayoutSpec.WRAP_CONTENT,
                heightSpec: LayoutSpec.WRAP_CONTENT,
            }
        })
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

    bind(state: SnakeModel): void {
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
                this.panel.addChild(item)
            }
            if (index === nodes.length - 1) {
                item.bgColor = Color.parse('#ffff00')
            } else {
                item.bgColor = Color.parse('#ff0000')
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

    onAttached(state: SnakeModel, v: SnakeView): void {
        v.start.onClick = this.start
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