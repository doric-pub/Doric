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
    constructor() {
        super(...arguments);
        this.panel = new doric.Stack;
        this.start = new doric.Text;
    }
    build(root) {
        root.bgColor = doric.Color.parse('#000000');
        const vlayout = new doric.VLayout;
        const title = new doric.Text;
        title.text = "Snake";
        title.textSize = 20;
        title.textColor = doric.Color.parse("#ffffff");
        title.layoutConfig = {
            alignment: new doric.Gravity().centerX(),
            margin: {
                top: 20
            },
        };
        vlayout.space = 20;
        vlayout.layoutConfig = {
            alignment: new doric.Gravity().centerX().top()
        };
        this.panel.bgColor = doric.Color.parse('#00ff00');
        vlayout.addChild(title);
        vlayout.addChild(this.panel);
        root.addChild(vlayout);
        const hlayout = new doric.HLayout;
        this.start.text = "Start";
        this.start.textSize = 30;
        this.start.textColor = doric.Color.parse("#ffffff");
        hlayout.addChild(this.start);
        vlayout.addChild(hlayout);
        this.up = this.buildController("↑");
        this.down = this.buildController("↓");
        this.left = this.buildController("←");
        this.right = this.buildController("→");
        const controlArea = new doric.VLayout;
        controlArea.gravity = new doric.Gravity().centerX();
        controlArea.space = 10;
        controlArea.layoutConfig = {
            alignment: new doric.Gravity().centerX()
        };
        const line1 = new doric.HLayout;
        const line2 = new doric.HLayout;
        line2.space = 10;
        line1.addChild(this.up);
        line2.addChild(this.left);
        line2.addChild(this.down);
        line2.addChild(this.right);
        controlArea.addChild(line1);
        controlArea.addChild(line2);
        vlayout.addChild(controlArea);
    }
    buildController(text) {
        const ret = new doric.Text;
        ret.width = ret.height = 50;
        ret.bgColor = doric.Color.parse('#ffff00');
        ret.text = text;
        ret.textSize = 30;
        ret.textAlignment = new doric.Gravity().center();
        return ret;
    }
}
class SnakeVM extends doric.ViewModel {
    constructor() {
        super(...arguments);
        this.start = () => {
            if (this.timerId !== undefined) {
                clearInterval(this.timerId);
            }
            this.getModel().reset();
            this.timerId = setInterval(() => {
                this.getModel().step();
            }, 500);
        };
        this.stop = () => {
            if (this.timerId !== undefined) {
                clearInterval(this.timerId);
                this.timerId = undefined;
            }
        };
        this.left = () => {
            this.getModel().direction = Direction.left;
        };
        this.right = () => {
            this.getModel().direction = Direction.right;
        };
        this.up = () => {
            this.getModel().direction = Direction.up;
        };
        this.down = () => {
            this.getModel().direction = Direction.down;
        };
    }
    binding(v, model) {
        if (model.state === State.fail) {
            doric.loge('Game Over');
            this.stop();
        }
        v.start.onClick = this.start;
        v.panel.width = model.width * 10;
        v.panel.height = model.height * 10;
        let node = model.head;
        let nodes = [];
        while (node != undefined) {
            nodes.push(node);
            node = node.next;
        }
        nodes.push(model.food);
        nodes.forEach((e, index) => {
            let item = v.panel.children[index];
            if (item === undefined) {
                item = new doric.Stack;
                item.width = item.height = 10;
                v.panel.addChild(item);
            }
            if (index === nodes.length - 1) {
                item.bgColor = doric.Color.parse('#ffff00');
            }
            else {
                item.bgColor = doric.Color.parse('#ff0000');
            }
            item.x = e.x * 10;
            item.y = e.y * 10;
        });
        if (nodes.length < v.panel.children.length) {
            v.panel.children.length = nodes.length;
        }
        if (v.left) {
            v.left.onClick = this.left;
        }
        if (v.right) {
            v.right.onClick = this.right;
        }
        if (v.up) {
            v.up.onClick = this.up;
        }
        if (v.down) {
            v.down.onClick = this.down;
        }
    }
}
let SnakePanel = class SnakePanel extends doric.VMPanel {
    getVMClass() {
        return SnakeVM;
    }
    getModel() {
        return new SnakeModel(35, 35);
    }
    getViewHolder() {
        return new SnakeView;
    }
};
SnakePanel = __decorate([
    Entry
], SnakePanel);
//# sourceMappingURL=Snake.js.map
