'use strict';

var doric = require('doric');

var colors = [
    "#70a1ff",
    "#7bed9f",
    "#ff6b81",
    "#a4b0be",
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b" ].map(function (e) { return doric.Color.parse(e); });

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var State;
(function (State) {
    State[State["Unspecified"] = 0] = "Unspecified";
    State[State["BLACK"] = 1] = "BLACK";
    State[State["WHITE"] = 2] = "WHITE";
})(State || (State = {}));
var count = 13;
var AIComputer = function AIComputer(matrix) {
    this.wins = [];
    this.winCount = 0;
    this.matrix = matrix;
    for (var y = 0; y < count; y++) {
        for (var x = 0; x < count - 4; x++) {
            this.wins.push([]);
            for (var k = 0; k < 5; k++) {
                this.wins[this.winCount].push({
                    x: x + k,
                    y: y,
                });
            }
            this.winCount++;
        }
    }
    for (var x$1 = 0; x$1 < count; x$1++) {
        for (var y$1 = 0; y$1 < count - 4; y$1++) {
            this.wins.push([]);
            for (var k$1 = 0; k$1 < 5; k$1++) {
                this.wins[this.winCount].push({
                    x: x$1,
                    y: y$1 + k$1,
                });
            }
            this.winCount++;
        }
    }
    for (var x$2 = 0; x$2 < count - 4; x$2++) {
        for (var y$2 = 0; y$2 < count - 4; y$2++) {
            this.wins.push([]);
            for (var k$2 = 0; k$2 < 5; k$2++) {
                this.wins[this.winCount].push({
                    x: x$2 + k$2,
                    y: y$2 + k$2,
                });
            }
            this.winCount++;
        }
    }
    for (var x$3 = 0; x$3 < count - 4; x$3++) {
        for (var y$3 = count - 1; y$3 > 3; y$3--) {
            this.wins.push([]);
            for (var k$3 = 0; k$3 < 5; k$3++) {
                this.wins[this.winCount].push({
                    x: x$3 + k$3,
                    y: y$3 - k$3,
                });
            }
            this.winCount++;
        }
    }
};

var prototypeAccessors = { blackWins: { configurable: true },whiteWins: { configurable: true } };
prototypeAccessors.blackWins.get = function () {
        var this$1 = this;

    return this.wins.map(function (win) {
        var idx = 0;
        for (var i = 0, list = win; i < list.length; i += 1) {
            var e = list[i];

                switch (this$1.matrix.get(e.x + e.y * count)) {
                case State.BLACK:
                    idx++;
                    break;
                case State.WHITE:
                    return 0;
            }
        }
        return idx;
    });
};
prototypeAccessors.whiteWins.get = function () {
        var this$1 = this;

    return this.wins.map(function (win) {
        var idx = 0;
        for (var i = 0, list = win; i < list.length; i += 1) {
            var e = list[i];

                switch (this$1.matrix.get(e.x + e.y * count)) {
                case State.WHITE:
                    idx++;
                    break;
                case State.BLACK:
                    return 0;
            }
        }
        return idx;
    });
};
AIComputer.prototype.compute = function compute (matrix, role) {
        var this$1 = this;

    var myScore = new Array(matrix.length).fill(0);
    var rivalScore = new Array(matrix.length).fill(0);
    var myWins = role === State.BLACK ? this.blackWins : this.whiteWins;
    var rivalWins = role === State.BLACK ? this.whiteWins : this.blackWins;
    var max = 0;
    var retIdx = 0;
    matrix.forEach(function (state, idx) {
        if (state != State.Unspecified) {
            return;
        }
        this$1.wins.forEach(function (e, winIdx) {
            if (e.filter(function (e) { return (e.x + e.y * count) === idx; }).length === 0) {
                return;
            }
            switch (rivalWins[winIdx]) {
                case 1:
                    rivalScore[idx] += 1;
                    break;
                case 2:
                    rivalScore[idx] += 10;
                    break;
                case 3:
                    rivalScore[idx] += 100;
                    break;
                case 4:
                    rivalScore[idx] += 10000;
                    break;
            }
            switch (myWins[winIdx]) {
                case 1:
                    myScore[idx] += 2;
                    break;
                case 2:
                    myScore[idx] += 20;
                    break;
                case 3:
                    myScore[idx] += 200;
                    break;
                case 4:
                    myScore[idx] += 20000;
                    break;
            }
        });
        if (rivalScore[idx] > max) {
            max = rivalScore[idx];
            retIdx = idx;
        }
        else if (rivalScore[idx] == max) {
            if (myScore[idx] > myScore[retIdx]) {
                retIdx = idx;
            }
        }
        if (myScore[idx] > max) {
            max = myScore[idx];
            retIdx = idx;
        }
        else if (myScore[idx] == max) {
            if (rivalScore[idx] > rivalScore[retIdx]) {
                retIdx = idx;
            }
        }
    });
    return retIdx;
};

Object.defineProperties( AIComputer.prototype, prototypeAccessors );
var lineColor = doric.Color.BLACK;
function columLine() {
    return (new doric.Stack).apply({
        layoutConfig: doric.layoutConfig().most().configWidth(doric.LayoutSpec.JUST),
        width: 1,
        backgroundColor: lineColor,
    });
}
function rowLine() {
    return (new doric.Stack).apply({
        layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.JUST),
        height: 1,
        backgroundColor: lineColor,
    });
}
function pointer(size) {
    return (new doric.Stack).apply({
        layoutConfig: doric.layoutConfig().just(),
        width: size,
        height: size,
    });
}
var GameMode;
(function (GameMode) {
    GameMode[GameMode["P2P"] = 0] = "P2P";
    GameMode[GameMode["P2C"] = 1] = "P2C";
    GameMode[GameMode["C2P"] = 2] = "C2P";
})(GameMode || (GameMode = {}));
var GoBangVH = /*@__PURE__*/(function (ViewHolder) {
    function GoBangVH() {
        ViewHolder.apply(this, arguments);
        this.gap = 0;
        this.targetZone = [];
    }

    if ( ViewHolder ) GoBangVH.__proto__ = ViewHolder;
    GoBangVH.prototype = Object.create( ViewHolder && ViewHolder.prototype );
    GoBangVH.prototype.constructor = GoBangVH;
    GoBangVH.prototype.build = function build (root) {
        this.root = root;
    };
    GoBangVH.prototype.test = function test () {
        return __awaiter(this, void 0, void 0, function* () {
            var width = yield this.view.getWidth(context);
            doric.log("screen--- " + width);
        });
    };
    GoBangVH.prototype.actualBuild = function actualBuild (state) {
        var this$1 = this;

        var boardSize = state.gap * (state.count - 1);
        var gap = state.gap;
        var borderWidth = gap;
        this.gap = state.gap;
        setTimeout(function () { return __awaiter(this$1, void 0, void 0, function* () {
            this.test();
        }); }, 2000);
        this.view = doric.scroller(doric.vlayout([
            doric.text({
                text: "五子棋",
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[0],
                textAlignment: doric.gravity().center(),
                height: 50,
            }),
            doric.stack([
                doric.stack((new Array(count - 2)).fill(0).map(function (_, idx) {
                        return columLine().also(function (v) {
                            v.left = (idx + 1) * gap;
                        });
                    }).concat( (new Array(count - 2)).fill(0).map(function (_, idx) {
                        return rowLine().also(function (v) {
                            v.top = (idx + 1) * gap;
                        });
                    }) ), {
                    layoutConfig: doric.layoutConfig().just()
                        .configMargin({ top: borderWidth, left: borderWidth }),
                    width: boardSize,
                    height: boardSize,
                    border: {
                        width: 1,
                        color: lineColor,
                    },
                }) ].concat( this.targetZone = (new Array(count * count)).fill(0).map(function (_, idx) {
                    var row = Math.floor(idx / count);
                    var colum = idx % count;
                    return pointer(gap).also(function (v) {
                        v.top = (row - 0.5) * gap + borderWidth;
                        v.left = (colum - 0.5) * gap + borderWidth;
                    });
                }) ), {
                layoutConfig: doric.layoutConfig().just(),
                width: boardSize + 2 * borderWidth,
                height: boardSize + 2 * borderWidth,
                backgroundColor: doric.Color.parse("#E6B080"),
            }),
            this.gameMode = doric.text({
                text: "游戏模式",
                textSize: 20,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.JUST),
                height: 50,
                backgroundColor: colors[8],
            }),
            doric.hlayout([
                this.currentRole = doric.text({
                    text: "当前:",
                    textSize: 20,
                    textColor: doric.Color.WHITE,
                    layoutConfig: doric.layoutConfig().just().configWeight(1),
                    height: 50,
                    backgroundColor: colors[1],
                }),
                this.result = doric.text({
                    text: "获胜方:",
                    textSize: 20,
                    textColor: doric.Color.WHITE,
                    layoutConfig: doric.layoutConfig().just().configWeight(1),
                    height: 50,
                    backgroundColor: colors[2],
                }) ], {
                layoutConfig: doric.layoutConfig().fit().configWidth(doric.LayoutSpec.MOST),
            }),
            this.assistant = doric.text({
                text: "提示",
                textSize: 20,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just().configWidth(doric.LayoutSpec.MOST),
                height: 50,
                backgroundColor: colors[3],
            }) ], {
            layoutConfig: doric.layoutConfig().fit(),
            backgroundColor: doric.Color.parse('#ecf0f1'),
        })).in(this.root);
    };

    return GoBangVH;
}(doric.ViewHolder));
var GoBangVM = /*@__PURE__*/(function (ViewModel) {
    function GoBangVM () {
        ViewModel.apply(this, arguments);
    }

    if ( ViewModel ) GoBangVM.__proto__ = ViewModel;
    GoBangVM.prototype = Object.create( ViewModel && ViewModel.prototype );
    GoBangVM.prototype.constructor = GoBangVM;

    GoBangVM.prototype.onAttached = function onAttached (state, vh) {
        var this$1 = this;

        if (!this.computer) {
            this.computer = new AIComputer(state.matrix);
        }
        vh.actualBuild(state);
        vh.targetZone.forEach(function (e, idx) {
            e.onClick = function () {
                if (state.gameState !== 'idle') {
                    return;
                }
                var zoneState = state.matrix.get(idx);
                if (zoneState === State.BLACK || zoneState === State.WHITE) {
                    doric.modal(context).toast('This position had been token.');
                    return;
                }
                if (state.anchor === undefined || state.anchor != idx) {
                    this$1.updateState(function (it) {
                        it.anchor = idx;
                    });
                }
                else {
                    this$1.updateState(function (it) {
                        if (it.role === 'black') {
                            it.matrix.set(idx, State.BLACK);
                            it.role = 'white';
                        }
                        else {
                            it.matrix.set(idx, State.WHITE);
                            it.role = 'black';
                        }
                        it.anchor = undefined;
                        if (this$1.checkResult(idx)) {
                            doric.modal(context).toast(("恭喜获胜方" + (it.role === 'white' ? "黑方" : "白方")));
                            it.gameState = it.role === 'white' ? 'blackWin' : 'whiteWin';
                        }
                        else {
                            if (it.role === 'black' && it.gameMode === GameMode.C2P) {
                                setTimeout(function () {
                                    this$1.computeNextStep(it);
                                }, 0);
                            }
                            else if (it.role === 'white' && it.gameMode === GameMode.P2C) {
                                setTimeout(function () {
                                    this$1.computeNextStep(it);
                                }, 0);
                            }
                        }
                    });
                }
            };
        });
        vh.gameMode.onClick = function () {
            doric.popover(context).show(doric.vlayout([].concat( [
                    {
                        label: "黑方:人 白方:人",
                        mode: GameMode.P2P,
                    },
                    {
                        label: "黑方:人 白方:机",
                        mode: GameMode.P2C,
                    },
                    {
                        label: "黑方:机 白方:人",
                        mode: GameMode.C2P,
                    } ].map(function (e) { return doric.text({
                    text: e.label,
                    textSize: 20,
                    textColor: doric.Color.WHITE,
                    layoutConfig: doric.layoutConfig().just(),
                    height: 50,
                    width: 300,
                    backgroundColor: (state.gameMode === e.mode) ? doric.Color.parse('#636e72') : doric.Color.parse('#b2bec3'),
                    onClick: function () {
                        this$1.updateState(function (s) {
                            s.gameMode = e.mode;
                            this$1.reset(s);
                        });
                        doric.popover(context).dismiss();
                    },
                }); }) ), {
                layoutConfig: doric.layoutConfig().most(),
                onClick: function () {
                    doric.popover(context).dismiss();
                },
                gravity: doric.Gravity.Center,
            }));
        };
        vh.result.onClick = function () {
            switch (state.gameState) {
                case "idle":
                    this$1.updateState(function (state) {
                        this$1.reset(state);
                    });
                    break;
            }
        };
        vh.currentRole.onClick = function () {
            switch (state.gameState) {
                case "idle":
                    break;
                case "blackWin":
                case "whiteWin":
                    this$1.updateState(function (state) {
                        this$1.reset(state);
                    });
                    break;
            }
        };
        vh.assistant.onClick = function () {
            var it = this$1.getState();
            if (it.gameState !== 'idle') {
                return;
            }
            this$1.computeNextStep(it);
            if (it.gameState !== 'idle') {
                return;
            }
            if (it.role === 'black' && it.gameMode === GameMode.C2P) {
                setTimeout(function () {
                    this$1.computeNextStep(it);
                }, 0);
            }
            else if (it.role === 'white' && it.gameMode === GameMode.P2C) {
                setTimeout(function () {
                    this$1.computeNextStep(it);
                }, 0);
            }
        };
    };
    GoBangVM.prototype.computeNextStep = function computeNextStep (it) {
        var this$1 = this;

        var tempMatrix = new Array(count * count).fill(0).map(function (_, idx) {
            return it.matrix.get(idx) || State.Unspecified;
        });
        var idx = 0;
        do {
            idx = this.computer.compute(tempMatrix, it.role === 'black' ? State.BLACK : State.WHITE);
        } while (it.matrix.get(idx) === State.Unspecified);
        this.updateState(function (state) {
            state.matrix.set(idx, state.role === 'black' ? State.BLACK : State.WHITE);
            state.role = state.role === 'black' ? 'white' : 'black';
            if (this$1.checkResult(idx)) {
                doric.modal(context).toast(("恭喜获胜方" + (it.role === 'white' ? "黑方" : "白方")));
                it.gameState = it.role === 'white' ? 'blackWin' : 'whiteWin';
            }
        });
    };
    GoBangVM.prototype.reset = function reset (it) {
        it.matrix.clear();
        it.gameState = 'idle';
        it.role = "black";
        it.anchor = undefined;
        this.computer = new AIComputer(it.matrix);
        if (it.gameMode === GameMode.C2P) {
            var idx = Math.floor(Math.random() * count) * count + Math.floor(Math.random() * count);
            it.matrix.set(idx, State.BLACK);
            it.role = 'white';
        }
    };
    GoBangVM.prototype.onBind = function onBind (state, vh) {
        vh.targetZone.forEach(function (v, idx) {
            var zoneState = state.matrix.get(idx);
            switch (zoneState) {
                case State.BLACK:
                    v.also(function (it) {
                        it.backgroundColor = doric.Color.BLACK;
                        it.corners = state.gap / 2;
                        it.border = {
                            color: doric.Color.TRANSPARENT,
                            width: 0,
                        };
                    });
                    break;
                case State.WHITE:
                    v.also(function (it) {
                        it.backgroundColor = doric.Color.WHITE;
                        it.corners = state.gap / 2;
                        it.border = {
                            color: doric.Color.TRANSPARENT,
                            width: 0,
                        };
                    });
                    break;
                default:
                    v.also(function (it) {
                        it.backgroundColor = doric.Color.TRANSPARENT;
                        it.corners = 0;
                        it.border = {
                            color: doric.Color.TRANSPARENT,
                            width: 0,
                        };
                    });
                    break;
            }
            if (state.anchor === idx) {
                v.also(function (it) {
                    it.backgroundColor = doric.Color.RED.alpha(0.1);
                    it.corners = 0;
                    it.border = {
                        color: doric.Color.RED,
                        width: 1,
                    };
                });
            }
        });
        vh.gameMode.text = "游戏模式:  黑方 " + (state.gameMode === GameMode.C2P ? "机" : "人") + " 白方 " + (state.gameMode === GameMode.P2C ? "机" : "人");
        switch (state.gameState) {
            case "idle":
                vh.result.text = "重新开始";
                vh.currentRole.text = "当前: " + ((state.role === 'black') ? "黑方" : "白方");
                break;
            case "blackWin":
                vh.result.text = "黑方获胜";
                vh.currentRole.text = "重新开始";
                break;
            case "whiteWin":
                vh.result.text = "白方获胜";
                vh.currentRole.text = "重新开始";
                break;
        }
    };
    GoBangVM.prototype.checkResult = function checkResult (pos) {
        var matrix = this.getState().matrix;
        var state = matrix.get(pos);
        var y = Math.floor(pos / count);
        var x = pos % count;
        var getState = function (x, y) { return matrix.get(y * count + x); };
        ///Horitonzal
        {
            var left = x;
            while (left >= 1) {
                if (getState(left - 1, y) === state) {
                    left -= 1;
                }
                else {
                    break;
                }
            }
            var right = x;
            while (right <= count - 2) {
                if (getState(right + 1, y) === state) {
                    right += 1;
                }
                else {
                    break;
                }
            }
            if (right - left >= 4) {
                return true;
            }
        }
        ///Vertical
        {
            var top = y;
            while (top >= 1) {
                if (getState(x, top - 1) === state) {
                    top -= 1;
                }
                else {
                    break;
                }
            }
            var bottom = y;
            while (bottom <= count - 2) {
                if (getState(x, bottom + 1) === state) {
                    bottom += 1;
                }
                else {
                    break;
                }
            }
            if (bottom - top >= 4) {
                return true;
            }
        }
        ///LT-RB
        {
            var startX = x, startY = y;
            while (startX >= 1 && startY >= 1) {
                if (getState(startX - 1, startY - 1) === state) {
                    startX -= 1;
                    startY -= 1;
                }
                else {
                    break;
                }
            }
            var endX = x, endY = y;
            while (endX <= count - 2 && endY <= count - 2) {
                if (getState(endX + 1, endY + 1) === state) {
                    endX += 1;
                    endY += 1;
                }
                else {
                    break;
                }
            }
            if (endX - startX >= 4) {
                return true;
            }
        }
        ///LB-RT
        {
            var startX$1 = x, startY$1 = y;
            while (startX$1 >= 1 && startY$1 <= count + 2) {
                if (getState(startX$1 - 1, startY$1 + 1) === state) {
                    startX$1 -= 1;
                    startY$1 += 1;
                }
                else {
                    break;
                }
            }
            var endX$1 = x, endY$1 = y;
            while (endX$1 <= count - 2 && endY$1 >= 1) {
                if (getState(endX$1 + 1, endY$1 - 1) === state) {
                    endX$1 += 1;
                    endY$1 -= 1;
                }
                else {
                    break;
                }
            }
            if (endX$1 - startX$1 >= 4) {
                return true;
            }
        }
        return false;
    };

    return GoBangVM;
}(doric.ViewModel));
var Gobang = /*@__PURE__*/(function (VMPanel) {
    function Gobang () {
        VMPanel.apply(this, arguments);
    }

    if ( VMPanel ) Gobang.__proto__ = VMPanel;
    Gobang.prototype = Object.create( VMPanel && VMPanel.prototype );
    Gobang.prototype.constructor = Gobang;

    Gobang.prototype.getViewModelClass = function getViewModelClass () {
        return GoBangVM;
    };
    Gobang.prototype.getState = function getState () {
        return {
            count: count,
            gap: this.getRootView().width / 14,
            role: "black",
            matrix: new Map,
            gameMode: GameMode.P2C,
            gameState: "idle"
        };
    };
    Gobang.prototype.getViewHolderClass = function getViewHolderClass () {
        return GoBangVH;
    };

    return Gobang;
}(doric.VMPanel));
Gobang = __decorate([
    Entry
], Gobang);
//# sourceMappingURL=Gobang.es5.js.map
