'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
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
var SnakeModel = function SnakeModel(w, h) {
    this.state = State.idel;
    this.direction = Direction.right;
    this.food = { x: -1, y: -1 };
    this.head = {
        x: 0,
        y: 0,
    };
    this.width = w;
    this.height = h;
};

var prototypeAccessors = { tail: { configurable: true },score: { configurable: true } };
SnakeModel.prototype.refreshFood = function refreshFood () {
    this.food.x = Math.floor(Math.random() * (this.width - 1));
    this.food.y = Math.floor(Math.random() * (this.height - 1));
};
prototypeAccessors.tail.get = function () {
    var node = this.head;
    while (node.next !== undefined) {
        node = node.next;
    }
    return node;
};
prototypeAccessors.score.get = function () {
    var node = this.head;
    var n = 0;
    while (node.next !== undefined) {
        n++;
        node = node.next;
    }
    return n;
};
SnakeModel.prototype.forward = function forward (node) {
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
};
SnakeModel.prototype.step = function step () {
    if (this.state !== State.run) {
        return;
    }
    var tail = this.tail;
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
        var head = { x: this.food.x, y: this.food.y };
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
};
SnakeModel.prototype.crashAtSelf = function crashAtSelf () {
    var cur = this.head.next;
    while (cur !== undefined) {
        if (cur.x == this.head.x && cur.y == this.head.y) {
            return true;
        }
        cur = cur.next;
    }
    return false;
};
SnakeModel.prototype.reset = function reset () {
    this.direction = Direction.right;
    this.state = State.run;
    this.head.x = 0;
    this.head.y = 0;
    this.head.next = undefined;
    this.refreshFood();
};

Object.defineProperties( SnakeModel.prototype, prototypeAccessors );
var SnakeView = /*@__PURE__*/(function (ViewHolder) {
    function SnakeView () {
        ViewHolder.apply(this, arguments);
    }

    if ( ViewHolder ) SnakeView.__proto__ = ViewHolder;
    SnakeView.prototype = Object.create( ViewHolder && ViewHolder.prototype );
    SnakeView.prototype.constructor = SnakeView;

    SnakeView.prototype.build = function build (root) {
        var this$1 = this;

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
            (new doric.Stack).also(function (panel) {
                panel.backgroundColor = doric.Color.parse('#00ff00');
                this$1.panel = panel;
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
                }).also(function (it) { return this$1.start = it; }) ]).also(function (it) {
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
                    }).also(function (it) { return this$1.up = it; })
                ]).also(function (it) {
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
                    }).also(function (it) { return this$1.left = it; }),
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
                    }).also(function (it) { return this$1.down = it; }),
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
                    }).also(function (it) { return this$1.right = it; }) ]).also(function (it) {
                    it.layoutConfig = {
                        widthSpec: doric.LayoutSpec.FIT,
                        heightSpec: doric.LayoutSpec.FIT,
                    };
                    it.space = 10;
                }) ]).also(function (controlArea) {
                controlArea.gravity = new doric.Gravity().centerX();
                controlArea.space = 10;
                controlArea.layoutConfig = {
                    alignment: new doric.Gravity().centerX(),
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT,
                };
            }) ]).also(function (it) {
            it.space = 20;
            it.layoutConfig = {
                alignment: new doric.Gravity().centerX().top(),
                widthSpec: doric.LayoutSpec.MOST,
                heightSpec: doric.LayoutSpec.MOST,
            };
            it.gravity = new doric.Gravity().centerX();
        }).in(root);
    };
    SnakeView.prototype.bind = function bind (state) {
        var this$1 = this;

        doric.log('build', state);
        this.panel.width = state.width * 10;
        this.panel.height = state.height * 10;
        var node = state.head;
        var nodes = [];
        while (node != undefined) {
            nodes.push(node);
            node = node.next;
        }
        nodes.push(state.food);
        nodes.forEach(function (e, index) {
            var item = this$1.panel.children[index];
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
                this$1.panel.addChild(item);
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
    };

    return SnakeView;
}(doric.ViewHolder));
var SnakeVM = /*@__PURE__*/(function (ViewModel) {
    function SnakeVM() {
        var this$1 = this;

        ViewModel.apply(this, arguments);
        this.start = function () {
            if (this$1.timerId !== undefined) {
                clearInterval(this$1.timerId);
            }
            this$1.updateState(function (it) { return it.reset(); });
            this$1.timerId = setInterval(function () {
                this$1.updateState(function (it) { return it.step(); });
                if (this$1.getState().state === State.fail) {
                    doric.loge('Game Over');
                    this$1.stop();
                }
            }, 500);
        };
        this.stop = function () {
            if (this$1.timerId !== undefined) {
                clearInterval(this$1.timerId);
                this$1.timerId = undefined;
            }
        };
        this.left = function () {
            this$1.updateState(function (it) { return it.direction = Direction.left; });
        };
        this.right = function () {
            this$1.updateState(function (it) { return it.direction = Direction.right; });
        };
        this.up = function () {
            this$1.updateState(function (it) { return it.direction = Direction.up; });
        };
        this.down = function () {
            this$1.updateState(function (it) { return it.direction = Direction.down; });
        };
    }

    if ( ViewModel ) SnakeVM.__proto__ = ViewModel;
    SnakeVM.prototype = Object.create( ViewModel && ViewModel.prototype );
    SnakeVM.prototype.constructor = SnakeVM;
    SnakeVM.prototype.onAttached = function onAttached (state, v) {
        var this$1 = this;

        doric.takeNonNull(v.start)(function (it) { return it.onClick = this$1.start; });
        doric.takeNonNull(v.left)(function (it) { return it.onClick = this$1.left; });
        doric.takeNonNull(v.right)(function (it) { return it.onClick = this$1.right; });
        doric.takeNonNull(v.up)(function (it) { return it.onClick = this$1.up; });
        doric.takeNonNull(v.down)(function (it) { return it.onClick = this$1.down; });
    };
    SnakeVM.prototype.onBind = function onBind (state, v) {
        v.bind(state);
    };

    return SnakeVM;
}(doric.ViewModel));
var SnakePanel = /*@__PURE__*/(function (VMPanel) {
    function SnakePanel () {
        VMPanel.apply(this, arguments);
    }

    if ( VMPanel ) SnakePanel.__proto__ = VMPanel;
    SnakePanel.prototype = Object.create( VMPanel && VMPanel.prototype );
    SnakePanel.prototype.constructor = SnakePanel;

    SnakePanel.prototype.getViewModelClass = function getViewModelClass () {
        return SnakeVM;
    };
    SnakePanel.prototype.getState = function getState () {
        return new SnakeModel(35, 35);
    };
    SnakePanel.prototype.getViewHolderClass = function getViewHolderClass () {
        return SnakeView;
    };

    return SnakePanel;
}(doric.VMPanel));
SnakePanel = __decorate([
    Entry
], SnakePanel);
//# sourceMappingURL=Snake.es5.js.map
