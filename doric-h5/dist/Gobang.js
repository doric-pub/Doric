'use strict';

var doric = require('doric');

const colors = [
    "#70a1ff",
    "#7bed9f",
    "#ff6b81",
    "#a4b0be",
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
].map(e => doric.Color.parse(e));

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var State;
(function (State) {
    State[State["Unspecified"] = 0] = "Unspecified";
    State[State["BLACK"] = 1] = "BLACK";
    State[State["WHITE"] = 2] = "WHITE";
})(State || (State = {}));
const count = 13;
class AIComputer {
    constructor(matrix) {
        this.wins = [];
        this.winCount = 0;
        this.matrix = matrix;
        for (let y = 0; y < count; y++) {
            for (let x = 0; x < count - 4; x++) {
                this.wins.push([]);
                for (let k = 0; k < 5; k++) {
                    this.wins[this.winCount].push({
                        x: x + k,
                        y,
                    });
                }
                this.winCount++;
            }
        }
        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count - 4; y++) {
                this.wins.push([]);
                for (let k = 0; k < 5; k++) {
                    this.wins[this.winCount].push({
                        x,
                        y: y + k,
                    });
                }
                this.winCount++;
            }
        }
        for (let x = 0; x < count - 4; x++) {
            for (let y = 0; y < count - 4; y++) {
                this.wins.push([]);
                for (let k = 0; k < 5; k++) {
                    this.wins[this.winCount].push({
                        x: x + k,
                        y: y + k,
                    });
                }
                this.winCount++;
            }
        }
        for (let x = 0; x < count - 4; x++) {
            for (let y = count - 1; y > 3; y--) {
                this.wins.push([]);
                for (let k = 0; k < 5; k++) {
                    this.wins[this.winCount].push({
                        x: x + k,
                        y: y - k,
                    });
                }
                this.winCount++;
            }
        }
    }
    get blackWins() {
        return this.wins.map((win) => {
            let idx = 0;
            for (let e of win) {
                switch (this.matrix.get(e.x + e.y * count)) {
                    case State.BLACK:
                        idx++;
                        break;
                    case State.WHITE:
                        return 0;
                }
            }
            return idx;
        });
    }
    get whiteWins() {
        return this.wins.map((win) => {
            let idx = 0;
            for (let e of win) {
                switch (this.matrix.get(e.x + e.y * count)) {
                    case State.WHITE:
                        idx++;
                        break;
                    case State.BLACK:
                        return 0;
                }
            }
            return idx;
        });
    }
    compute(matrix, role) {
        const myScore = new Array(matrix.length).fill(0);
        const rivalScore = new Array(matrix.length).fill(0);
        const myWins = role === State.BLACK ? this.blackWins : this.whiteWins;
        const rivalWins = role === State.BLACK ? this.whiteWins : this.blackWins;
        let max = 0;
        let retIdx = 0;
        matrix.forEach((state, idx) => {
            if (state != State.Unspecified) {
                return;
            }
            this.wins.forEach((e, winIdx) => {
                if (e.filter(e => (e.x + e.y * count) === idx).length === 0) {
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
    }
}
const lineColor = doric.Color.BLACK;
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
class GoBangVH extends doric.ViewHolder {
    constructor() {
        super(...arguments);
        this.gap = 0;
        this.targetZone = [];
    }
    build(root) {
        this.root = root;
    }
    actualBuild(state) {
        const boardSize = state.gap * (state.count - 1);
        const gap = state.gap;
        const borderWidth = gap;
        this.gap = state.gap;
        doric.scroller(doric.vlayout([
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
                doric.stack([
                    ...(new Array(count - 2)).fill(0).map((_, idx) => {
                        return columLine().also(v => {
                            v.left = (idx + 1) * gap;
                        });
                    }),
                    ...(new Array(count - 2)).fill(0).map((_, idx) => {
                        return rowLine().also(v => {
                            v.top = (idx + 1) * gap;
                        });
                    }),
                ])
                    .apply({
                    layoutConfig: doric.layoutConfig().just()
                        .configMargin({ top: borderWidth, left: borderWidth }),
                    width: boardSize,
                    height: boardSize,
                    border: {
                        width: 1,
                        color: lineColor,
                    },
                }),
                ...this.targetZone = (new Array(count * count)).fill(0).map((_, idx) => {
                    const row = Math.floor(idx / count);
                    const colum = idx % count;
                    return pointer(gap).also(v => {
                        v.top = (row - 0.5) * gap + borderWidth;
                        v.left = (colum - 0.5) * gap + borderWidth;
                    });
                }),
            ]).apply({
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
                }),
            ]).apply({
                layoutConfig: doric.layoutConfig().fit().configWidth(doric.LayoutSpec.MOST),
            }),
            this.assistant = doric.text({
                text: "提示",
                textSize: 20,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just().configWidth(doric.LayoutSpec.MOST),
                height: 50,
                backgroundColor: colors[3],
            }),
        ])
            .apply({
            layoutConfig: doric.layoutConfig().fit(),
            backgroundColor: doric.Color.parse('#ecf0f1'),
        })).in(this.root);
    }
}
class GoBangVM extends doric.ViewModel {
    onAttached(state, vh) {
        if (!this.computer) {
            this.computer = new AIComputer(state.matrix);
        }
        vh.actualBuild(state);
        vh.targetZone.forEach((e, idx) => {
            e.onClick = () => {
                if (state.gameState !== 'idle') {
                    return;
                }
                const zoneState = state.matrix.get(idx);
                if (zoneState === State.BLACK || zoneState === State.WHITE) {
                    doric.modal(context).toast('This position had been token.');
                    return;
                }
                if (state.anchor === undefined || state.anchor != idx) {
                    this.updateState(it => {
                        it.anchor = idx;
                    });
                }
                else {
                    this.updateState(it => {
                        if (it.role === 'black') {
                            it.matrix.set(idx, State.BLACK);
                            it.role = 'white';
                        }
                        else {
                            it.matrix.set(idx, State.WHITE);
                            it.role = 'black';
                        }
                        it.anchor = undefined;
                        if (this.checkResult(idx)) {
                            doric.modal(context).toast(`恭喜获胜方${it.role === 'white' ? "黑方" : "白方"}`);
                            it.gameState = it.role === 'white' ? 'blackWin' : 'whiteWin';
                        }
                        else {
                            if (it.role === 'black' && it.gameMode === GameMode.C2P) {
                                setTimeout(() => {
                                    this.computeNextStep(it);
                                }, 0);
                            }
                            else if (it.role === 'white' && it.gameMode === GameMode.P2C) {
                                setTimeout(() => {
                                    this.computeNextStep(it);
                                }, 0);
                            }
                        }
                    });
                }
            };
        });
        vh.gameMode.onClick = () => {
            doric.popover(context).show(doric.vlayout([
                ...[
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
                    },
                ].map((e) => doric.text({
                    text: e.label,
                    textSize: 20,
                    textColor: doric.Color.WHITE,
                    layoutConfig: doric.layoutConfig().just(),
                    height: 50,
                    width: 300,
                    backgroundColor: (state.gameMode === e.mode) ? doric.Color.parse('#636e72') : doric.Color.parse('#b2bec3'),
                    onClick: () => {
                        this.updateState(s => {
                            s.gameMode = e.mode;
                            this.reset(s);
                        });
                        doric.popover(context).dismiss();
                    },
                }))
            ])
                .apply({
                layoutConfig: doric.layoutConfig().most(),
                onClick: () => {
                    doric.popover(context).dismiss();
                },
                gravity: doric.Gravity.Center,
            }));
        };
        vh.result.onClick = () => {
            switch (state.gameState) {
                case "idle":
                    this.updateState(state => {
                        this.reset(state);
                    });
                    break;
            }
        };
        vh.currentRole.onClick = () => {
            switch (state.gameState) {
                case "idle":
                    break;
                case "blackWin":
                case "whiteWin":
                    this.updateState(state => {
                        this.reset(state);
                    });
                    break;
            }
        };
        vh.assistant.onClick = () => {
            const it = this.getState();
            if (it.gameState !== 'idle') {
                return;
            }
            this.computeNextStep(it);
            if (it.gameState !== 'idle') {
                return;
            }
            if (it.role === 'black' && it.gameMode === GameMode.C2P) {
                setTimeout(() => {
                    this.computeNextStep(it);
                }, 0);
            }
            else if (it.role === 'white' && it.gameMode === GameMode.P2C) {
                setTimeout(() => {
                    this.computeNextStep(it);
                }, 0);
            }
        };
    }
    computeNextStep(it) {
        const tempMatrix = new Array(count * count).fill(0).map((_, idx) => {
            return it.matrix.get(idx) || State.Unspecified;
        });
        let idx = 0;
        do {
            idx = this.computer.compute(tempMatrix, it.role === 'black' ? State.BLACK : State.WHITE);
        } while (it.matrix.get(idx) === State.Unspecified);
        this.updateState(state => {
            state.matrix.set(idx, state.role === 'black' ? State.BLACK : State.WHITE);
            state.role = state.role === 'black' ? 'white' : 'black';
            if (this.checkResult(idx)) {
                doric.modal(context).toast(`恭喜获胜方${it.role === 'white' ? "黑方" : "白方"}`);
                it.gameState = it.role === 'white' ? 'blackWin' : 'whiteWin';
            }
        });
    }
    reset(it) {
        it.matrix.clear();
        it.gameState = 'idle';
        it.role = "black";
        it.anchor = undefined;
        this.computer = new AIComputer(it.matrix);
        if (it.gameMode === GameMode.C2P) {
            const idx = Math.floor(Math.random() * count) * count + Math.floor(Math.random() * count);
            it.matrix.set(idx, State.BLACK);
            it.role = 'white';
        }
    }
    onBind(state, vh) {
        vh.targetZone.forEach((v, idx) => {
            const zoneState = state.matrix.get(idx);
            switch (zoneState) {
                case State.BLACK:
                    v.also(it => {
                        it.backgroundColor = doric.Color.BLACK;
                        it.corners = state.gap / 2;
                        it.border = {
                            color: doric.Color.TRANSPARENT,
                            width: 0,
                        };
                    });
                    break;
                case State.WHITE:
                    v.also(it => {
                        it.backgroundColor = doric.Color.WHITE;
                        it.corners = state.gap / 2;
                        it.border = {
                            color: doric.Color.TRANSPARENT,
                            width: 0,
                        };
                    });
                    break;
                default:
                    v.also(it => {
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
                v.also(it => {
                    it.backgroundColor = doric.Color.RED.alpha(0.1);
                    it.corners = 0;
                    it.border = {
                        color: doric.Color.RED,
                        width: 1,
                    };
                });
            }
        });
        vh.gameMode.text = `游戏模式:  黑方 ${state.gameMode === GameMode.C2P ? "机" : "人"} 白方 ${state.gameMode === GameMode.P2C ? "机" : "人"}`;
        switch (state.gameState) {
            case "idle":
                vh.result.text = "重新开始";
                vh.currentRole.text = `当前: ${(state.role === 'black') ? "黑方" : "白方"}`;
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
    }
    checkResult(pos) {
        const matrix = this.getState().matrix;
        const state = matrix.get(pos);
        const y = Math.floor(pos / count);
        const x = pos % count;
        const getState = (x, y) => matrix.get(y * count + x);
        ///Horitonzal
        {
            let left = x;
            while (left >= 1) {
                if (getState(left - 1, y) === state) {
                    left -= 1;
                }
                else {
                    break;
                }
            }
            let right = x;
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
            let top = y;
            while (top >= 1) {
                if (getState(x, top - 1) === state) {
                    top -= 1;
                }
                else {
                    break;
                }
            }
            let bottom = y;
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
            let startX = x, startY = y;
            while (startX >= 1 && startY >= 1) {
                if (getState(startX - 1, startY - 1) === state) {
                    startX -= 1;
                    startY -= 1;
                }
                else {
                    break;
                }
            }
            let endX = x, endY = y;
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
            let startX = x, startY = y;
            while (startX >= 1 && startY <= count + 2) {
                if (getState(startX - 1, startY + 1) === state) {
                    startX -= 1;
                    startY += 1;
                }
                else {
                    break;
                }
            }
            let endX = x, endY = y;
            while (endX <= count - 2 && endY >= 1) {
                if (getState(endX + 1, endY - 1) === state) {
                    endX += 1;
                    endY -= 1;
                }
                else {
                    break;
                }
            }
            if (endX - startX >= 4) {
                return true;
            }
        }
        return false;
    }
}
let Gobang = class Gobang extends doric.VMPanel {
    getViewModelClass() {
        return GoBangVM;
    }
    getState() {
        return {
            count,
            gap: this.getRootView().width / 14,
            role: "black",
            matrix: new Map,
            gameMode: GameMode.P2C,
            gameState: "idle"
        };
    }
    getViewHolderClass() {
        return GoBangVH;
    }
    onShow() {
        doric.navbar(context).setTitle("五子棋");
    }
};
Gobang = __decorate([
    Entry
], Gobang);
//# sourceMappingURL=Gobang.js.map
