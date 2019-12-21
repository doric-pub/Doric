'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Direction;
(function (Direction) {
    Direction[Direction["left"] = 0] = "left";
    Direction[Direction["right"] = 1] = "right";
    Direction[Direction["up"] = 2] = "up";
    Direction[Direction["down"] = 3] = "down";
})(Direction || (Direction = {}));
var State;
(function (State) {
    State[State["idel"] = 0] = "idel";
    State[State["run"] = 1] = "run";
    State[State["fail"] = 2] = "fail";
})(State || (State = {}));
class SnakeModel {
    constructor(w, h) {
        this.state = State.idel;
        this.direction = Direction.right;
        this.food = { x: -1, y: -1 };
        this.head = {
            x: 0,
            y: 0,
        };
        this.width = w;
        this.height = h;
    }
    refreshFood() {
        this.food.x = Math.floor(Math.random() * (this.width - 1));
        this.food.y = Math.floor(Math.random() * (this.height - 1));
    }
    get tail() {
        let node = this.head;
        while (node.next !== undefined) {
            node = node.next;
        }
        return node;
    }
    get score() {
        let node = this.head;
        let n = 0;
        while (node.next !== undefined) {
            n++;
            node = node.next;
        }
        return n;
    }
    forward(node) {
        switch (this.direction) {
            case Direction.left:
                node.x -= 1;
                break;
            case Direction.right:
                node.x += 1;
                break;
            case Direction.up:
                node.y -= 1;
                break;
            case Direction.down:
                node.y += 1;
                break;
        }
    }
    step() {
        if (this.state !== State.run) {
            return;
        }
        let tail = this.tail;
        while (tail.prev != undefined) {
            tail.x = tail.prev.x;
            tail.y = tail.prev.y;
            tail = tail.prev;
        }
        this.forward(this.head);
        if (this.head.x < 0 || this.head.x >= this.width
            || this.head.y < 0 || this.head.y >= this.height) {
            //If out of bound
            doric.loge('out of bound');
            this.state = State.fail;
        }
        else if (this.head.x == this.food.x && this.head.y == this.food.y) {
            //If eat food
            let head = { x: this.food.x, y: this.food.y };
            doric.log('eat food', head);
            this.forward(head);
            this.head.prev = head;
            head.next = this.head;
            this.head = head;
            this.refreshFood();
        }
        if (this.crashAtSelf()) {
            //If crash at self
            doric.loge('crash at self');
            this.state = State.fail;
        }
    }
    crashAtSelf() {
        let cur = this.head.next;
        while (cur !== undefined) {
            if (cur.x == this.head.x && cur.y == this.head.y) {
                return true;
            }
            cur = cur.next;
        }
        return false;
    }
    reset() {
        this.direction = Direction.right;
        this.state = State.run;
        this.head.x = 0;
        this.head.y = 0;
        this.head.next = undefined;
        this.refreshFood();
    }
}
class SnakeView extends doric.ViewHolder {
    build(root) {
        root.backgroundColor = doric.Color.parse('#000000');
        doric.vlayout([
            doric.text({
                text: "Snake",
                textSize: 20,
                textColor: doric.Color.parse("#ffffff"),
                layoutConfig: {
                    alignment: new doric.Gravity().centerX(),
                    margin: {
                        top: 20
                    },
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT,
                },
            }),
            (new doric.Stack).also(panel => {
                panel.backgroundColor = doric.Color.parse('#00ff00');
                this.panel = panel;
            }),
            doric.hlayout([
                doric.text({
                    text: "Start",
                    textSize: 30,
                    textColor: doric.Color.parse("#ffffff"),
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.FIT,
                        heightSpec: doric.LayoutSpec.FIT,
                    },
                }).also(it => this.start = it),
            ]).also(it => {
                it.layoutConfig = {
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT,
                };
            }),
            doric.vlayout([
                doric.hlayout([
                    doric.text({
                        width: 50,
                        height: 50,
                        text: "↑",
                        textSize: 30,
                        textAlignment: new doric.Gravity().center(),
                        backgroundColor: doric.Color.parse('#ffff00'),
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                        },
                    }).also(it => this.up = it)
                ]).also(it => {
                    it.layoutConfig = {
                        widthSpec: doric.LayoutSpec.FIT,
                        heightSpec: doric.LayoutSpec.FIT,
                    };
                }),
                doric.hlayout([
                    doric.text({
                        width: 50,
                        height: 50,
                        text: "←",
                        textSize: 30,
                        textAlignment: new doric.Gravity().center(),
                        backgroundColor: doric.Color.parse('#ffff00'),
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                        },
                    }).also(it => this.left = it),
                    doric.text({
                        width: 50,
                        height: 50,
                        text: "↓",
                        textSize: 30,
                        textAlignment: new doric.Gravity().center(),
                        backgroundColor: doric.Color.parse('#ffff00'),
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                        },
                    }).also(it => this.down = it),
                    doric.text({
                        width: 50,
                        height: 50,
                        text: "→",
                        textSize: 30,
                        textAlignment: new doric.Gravity().center(),
                        backgroundColor: doric.Color.parse('#ffff00'),
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                        },
                    }).also(it => this.right = it),
                ]).also(it => {
                    it.layoutConfig = {
                        widthSpec: doric.LayoutSpec.FIT,
                        heightSpec: doric.LayoutSpec.FIT,
                    };
                    it.space = 10;
                }),
            ]).also(controlArea => {
                controlArea.gravity = new doric.Gravity().centerX();
                controlArea.space = 10;
                controlArea.layoutConfig = {
                    alignment: new doric.Gravity().centerX(),
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT,
                };
            }),
        ]).also(it => {
            it.space = 20;
            it.layoutConfig = {
                alignment: new doric.Gravity().centerX().top(),
                widthSpec: doric.LayoutSpec.MOST,
                heightSpec: doric.LayoutSpec.MOST,
            };
            it.gravity = new doric.Gravity().centerX();
        }).in(root);
    }
    bind(state) {
        doric.log('build', state);
        this.panel.width = state.width * 10;
        this.panel.height = state.height * 10;
        let node = state.head;
        let nodes = [];
        while (node != undefined) {
            nodes.push(node);
            node = node.next;
        }
        nodes.push(state.food);
        nodes.forEach((e, index) => {
            let item = this.panel.children[index];
            if (item === undefined) {
                item = new doric.Stack;
                item.width = item.height = 10;
                item.corners = 5;
                item.shadow = {
                    color: doric.Color.GRAY,
                    opacity: 1,
                    radius: 3,
                    offsetX: 3,
                    offsetY: 3,
                };
                this.panel.addChild(item);
            }
            if (index === nodes.length - 1) {
                item.backgroundColor = doric.Color.parse('#ffff00');
            }
            else {
                item.backgroundColor = doric.Color.parse('#ff0000');
            }
            item.x = e.x * 10;
            item.y = e.y * 10;
        });
        if (nodes.length < this.panel.children.length) {
            this.panel.children.length = nodes.length;
        }
    }
}
class SnakeVM extends doric.ViewModel {
    constructor() {
        super(...arguments);
        this.start = () => {
            if (this.timerId !== undefined) {
                clearInterval(this.timerId);
            }
            this.updateState(it => it.reset());
            this.timerId = setInterval(() => {
                this.updateState(it => it.step());
                if (this.getState().state === State.fail) {
                    doric.loge('Game Over');
                    this.stop();
                }
            }, 500);
        };
        this.stop = () => {
            if (this.timerId !== undefined) {
                clearInterval(this.timerId);
                this.timerId = undefined;
            }
        };
        this.left = () => {
            this.updateState(it => it.direction = Direction.left);
        };
        this.right = () => {
            this.updateState(it => it.direction = Direction.right);
        };
        this.up = () => {
            this.updateState(it => it.direction = Direction.up);
        };
        this.down = () => {
            this.updateState(it => it.direction = Direction.down);
        };
    }
    onAttached(state, v) {
        doric.takeNonNull(v.start)(it => it.onClick = this.start);
        doric.takeNonNull(v.left)(it => it.onClick = this.left);
        doric.takeNonNull(v.right)(it => it.onClick = this.right);
        doric.takeNonNull(v.up)(it => it.onClick = this.up);
        doric.takeNonNull(v.down)(it => it.onClick = this.down);
    }
    onBind(state, v) {
        v.bind(state);
    }
}
let SnakePanel = class SnakePanel extends doric.VMPanel {
    getViewModelClass() {
        return SnakeVM;
    }
    getState() {
        return new SnakeModel(35, 35);
    }
    getViewHolderClass() {
        return SnakeView;
    }
};
SnakePanel = __decorate([
    Entry
], SnakePanel);
//# sourceMappingURL=Snake.js.map
