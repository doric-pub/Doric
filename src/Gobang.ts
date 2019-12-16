import { Stack, hlayout, Group, Color, stack, layoutConfig, LayoutSpec, vlayout, IVLayout, Text, ViewHolder, ViewModel, VMPanel, scroller, modal, text, gravity, Gravity, IHLayout, takeNonNull, View, log, popover } from "doric";
import { colors } from "./utils";


const lineColor = Color.BLACK
function columLine() {
    return (new Stack).apply({
        layoutConfig: layoutConfig().most().configWidth(LayoutSpec.JUST),
        width: 1,
        backgroundColor: lineColor,
    })
}

function rowLine() {
    return (new Stack).apply({
        layoutConfig: layoutConfig().most().configHeight(LayoutSpec.JUST),
        height: 1,
        backgroundColor: lineColor,
    })
}

function pointer(size: number) {
    return (new Stack).apply({
        layoutConfig: layoutConfig().just(),
        width: size,
        height: size,
    })
}

const count = 13
enum State {
    Unspecified,
    BLACK,
    WHITE,
}
enum GameMode {
    P2P,
    P2C,
    C2P,
}

interface GoBangState {
    count: number
    gap: number
    role: "white" | "black"
    matrix: Map<number, State>
    anchor?: number
    gameMode: GameMode
    reset: () => void
}

class GoBangVH extends ViewHolder {
    root!: Group
    gap = 0
    currentRole!: Text
    result!: Text
    targetZone: View[] = []
    gameMode!: Text
    build(root: Group): void {
        this.root = root
    }
    actualBuild(state: GoBangState): void {
        const boardSize = state.gap * (state.count - 1)
        const gap = state.gap
        const borderWidth = gap
        this.gap = state.gap
        scroller(
            vlayout([
                text({
                    text: "五子棋",
                    layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
                    textSize: 30,
                    textColor: Color.WHITE,
                    backgroundColor: colors[0],
                    textAlignment: gravity().center(),
                    height: 50,
                }),
                stack([
                    stack([
                        ...(new Array(count - 2)).fill(0).map((_, idx) => {
                            return columLine().also(v => {
                                v.left = (idx + 1) * gap
                            })
                        }),
                        ...(new Array(count - 2)).fill(0).map((_, idx) => {
                            return rowLine().also(v => {
                                v.top = (idx + 1) * gap
                            })
                        }),
                    ])
                        .apply({
                            layoutConfig: layoutConfig().just()
                                .configMargin({ top: borderWidth, left: borderWidth }),
                            width: boardSize,
                            height: boardSize,
                            border: {
                                width: 1,
                                color: lineColor,
                            },
                        }),
                    ...this.targetZone = (new Array(count * count)).fill(0).map((_, idx) => {
                        const row = Math.floor(idx / count)
                        const colum = idx % count
                        return pointer(gap).also(v => {
                            v.top = (row - 0.5) * gap + borderWidth
                            v.left = (colum - 0.5) * gap + borderWidth
                        })
                    }),
                ]).apply({
                    layoutConfig: layoutConfig().just(),
                    width: boardSize + 2 * borderWidth,
                    height: boardSize + 2 * borderWidth,
                    backgroundColor: Color.parse("#E6B080"),
                }),

                this.gameMode = text({
                    text: "游戏模式",
                    textSize: 20,
                    textColor: Color.WHITE,
                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.JUST),
                    height: 50,
                    backgroundColor: colors[3],
                }),
                hlayout([
                    this.currentRole = text({
                        text: "当前:",
                        textSize: 20,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just().configWeight(1),
                        height: 50,
                        backgroundColor: colors[1],
                    }),
                    this.result = text({
                        text: "获胜方:",
                        textSize: 20,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just().configWeight(1),
                        height: 50,
                        backgroundColor: colors[2],
                    }),
                ]).apply({
                    layoutConfig: layoutConfig().fit().configWidth(LayoutSpec.MOST),
                } as IHLayout),
            ])
                .apply({
                    layoutConfig: layoutConfig().fit(),
                    backgroundColor: Color.parse('#ecf0f1'),
                } as IVLayout)
        ).in(this.root)
    }
}

class GoBangVM extends ViewModel<GoBangState, GoBangVH>{
    onAttached(state: GoBangState, vh: GoBangVH) {
        vh.actualBuild(state)
        vh.targetZone.forEach((e, idx) => {
            e.onClick = () => {
                const zoneState = state.matrix.get(idx)
                if (zoneState === State.BLACK || zoneState === State.WHITE) {
                    modal(context).toast('This position had been token.')
                    return
                }
                if (state.anchor === undefined || state.anchor != idx) {
                    this.updateState(it => {
                        it.anchor = idx
                    })
                } else {
                    this.updateState(it => {
                        if (it.role === 'black') {
                            it.matrix.set(idx, State.BLACK)
                            it.role = 'white'
                        } else {
                            it.matrix.set(idx, State.WHITE)
                            it.role = 'black'
                        }
                        it.anchor = undefined
                        if (this.checkResult(idx)) {
                            modal(context).alert({
                                title: "游戏结束",
                                msg: `恭喜获胜方${it.role === 'white' ? "黑方" : "白方"}`,
                            }).then(() => {
                                this.updateState(s => {
                                    s.reset()
                                })
                            })
                        }
                    })
                }
            }
        })
        vh.gameMode.onClick = () => {
            popover(context).show(vlayout([
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
                ].map((e) => text({
                    text: e.label,
                    textSize: 20,
                    textColor: Color.WHITE,
                    layoutConfig: layoutConfig().just(),
                    height: 50,
                    width: 300,
                    backgroundColor: (state.gameMode === e.mode) ? Color.parse('#636e72') : Color.parse('#b2bec3'),
                    onClick: () => {
                        this.updateState(s => {
                            s.gameMode = e.mode
                            s.reset()
                        })
                        popover(context).dismiss()
                    },
                }))
            ])
                .apply({
                    layoutConfig: layoutConfig().most(),
                    onClick: () => {
                        popover(context).dismiss()
                    },
                    gravity: Gravity.Center,
                } as IVLayout)
            )
        }
    }

    onBind(state: GoBangState, vh: GoBangVH) {
        vh.targetZone.forEach((v, idx) => {
            const zoneState = state.matrix.get(idx)
            switch (zoneState) {
                case State.BLACK:
                    v.also(it => {
                        it.backgroundColor = Color.BLACK
                        it.corners = state.gap / 2
                        it.border = {
                            color: Color.TRANSPARENT,
                            width: 0,
                        }
                    })
                    break
                case State.WHITE:
                    v.also(it => {
                        it.backgroundColor = Color.WHITE
                        it.corners = state.gap / 2
                        it.border = {
                            color: Color.TRANSPARENT,
                            width: 0,
                        }
                    })
                    break
                default:
                    v.also(it => {
                        it.backgroundColor = Color.TRANSPARENT
                        it.corners = 0
                        it.border = {
                            color: Color.TRANSPARENT,
                            width: 0,
                        }
                    })
                    break
            }
            if (state.anchor === idx) {
                v.also(it => {
                    it.backgroundColor = Color.RED.alpha(0.1)
                    it.corners = 0
                    it.border = {
                        color: Color.RED,
                        width: 1,
                    }
                })
            }
        })
        vh.currentRole.text = `当前: ${(state.role === 'black') ? "黑方" : "白方"}`
        vh.gameMode.text = `游戏模式:  黑方 ${state.gameMode === GameMode.C2P ? "机" : "人"} 白方 ${state.gameMode === GameMode.P2C ? "机" : "人"}`
    }

    checkResult(pos: number) {
        const matrix = this.getState().matrix
        const state = matrix.get(pos)
        const y = Math.floor(pos / count)
        const x = pos % count
        const getState = (x: number, y: number) => matrix.get(y * count + x)
        ///Horitonzal
        {
            let left = x
            while (left >= 1) {
                if (getState(left - 1, y) === state) {
                    left -= 1
                } else {
                    break
                }
            }
            let right = x
            while (right <= count - 2) {
                if (getState(right + 1, y) === state) {
                    right += 1
                } else {
                    break
                }
            }
            if (right - left >= 4) {
                return true
            }
        }
        ///Vertical
        {
            let top = y
            while (top >= 1) {
                if (getState(x, top - 1) === state) {
                    top -= 1
                } else {
                    break
                }
            }
            let bottom = y
            while (bottom <= count - 2) {
                if (getState(x, bottom + 1) === state) {
                    bottom += 1
                } else {
                    break
                }
            }
            if (bottom - top >= 4) {
                return true
            }
        }

        ///LT-RB
        {
            let startX = x, startY = y
            while (startX >= 1 && startY >= 1) {
                if (getState(startX - 1, startY - 1) === state) {
                    startX -= 1
                    startY -= 1
                } else {
                    break
                }
            }
            let endX = x, endY = y
            while (endX <= count - 2 && endY <= count - 2) {
                if (getState(endX + 1, endY + 1) === state) {
                    endX += 1
                    endY += 1
                } else {
                    break
                }
            }
            if (endX - startX >= 4) {
                return true
            }
        }

        ///LB-RT
        {
            let startX = x, startY = y
            while (startX >= 1 && startY <= count + 2) {
                if (getState(startX - 1, startY + 1) === state) {
                    startX -= 1
                    startY += 1
                } else {
                    break
                }
            }
            let endX = x, endY = y
            while (endX <= count - 2 && endY >= 1) {
                if (getState(endX + 1, endY - 1) === state) {
                    endX += 1
                    endY -= 1
                } else {
                    break
                }
            }
            if (endX - startX >= 4) {
                return true
            }
        }
        return false
    }
}

@Entry
class Gobang extends VMPanel<GoBangState, GoBangVH> {
    getViewModelClass() {
        return GoBangVM
    }
    getState(): GoBangState {
        return {
            count,
            gap: this.getRootView().width / 14,
            role: "black",
            matrix: new Map,
            gameMode: GameMode.P2P,
            reset: function () {
                this.matrix.clear()
                this.role = "black"
                this.anchor = undefined
            }
        }
    }
    getViewHolderClass() {
        return GoBangVH
    }
}