import { Stack, Group, Color, stack, layoutConfig, LayoutSpec, vlayout, IVLayout, Text, ViewHolder, ViewModel, VMPanel, scroller } from "doric";
import { title } from "./utils";


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

interface GoBangState {
    count: number
    gap: number
    role: "white" | "black"
    matrix: Map<number, State>
}

class GoBangVH extends ViewHolder {
    pieces!: Stack
    root!: Group
    gap = 0
    onPieceDown?: (x: number, y: number) => void
    build(root: Group): void {
        this.root = root
    }
    actualBuild(state: GoBangState): void {
        const boardSize = state.gap * (state.count - 1)
        const gap = state.gap
        const borderWidth = gap
        let hintText: Text
        this.gap = state.gap
        scroller(
            vlayout([
                title("GoBang"),
                stack([
                    stack([
                        ...(new Array(count - 2)).fill(0).map((_, idx) => {
                            return columLine().also(v => {
                                v.left = (idx + 1) * gap
                            })
                        }
                        ),
                        ...(new Array(count - 2)).fill(0).map((_, idx) => {
                            return rowLine().also(v => {
                                v.top = (idx + 1) * gap
                            })
                        }
                        ),
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

                    ...(new Array(count * count)).fill(0).map((_, idx) => {
                        const row = Math.floor(idx / count)
                        const colum = idx % count
                        return pointer(gap).also(v => {
                            v.top = (row - 0.5) * gap + borderWidth
                            v.left = (colum - 0.5) * gap + borderWidth
                            v.onClick = () => {
                                hintText.text = `row:${row},colum:${colum}`
                                if (this.onPieceDown) {
                                    this.onPieceDown(colum, row)
                                }
                            }
                        })
                    }),
                    this.pieces = (new Stack).apply({
                        layoutConfig: layoutConfig().most(),
                    }),
                ]).apply({
                    layoutConfig: layoutConfig().just(),
                    width: boardSize + 2 * borderWidth,
                    height: boardSize + 2 * borderWidth,
                    backgroundColor: Color.parse("#E6B080"),
                }),
                hintText = title('Hint'),
            ])
                .apply({
                    layoutConfig: layoutConfig().fit(),
                    backgroundColor: Color.parse('#ecf0f1'),
                } as IVLayout)
        ).in(this.root)
    }

    addPiece(pos: number, role: "black" | "white") {
        const x = Math.floor(pos / count)
        const y = pos % count
        const piece = (new Stack).also(v => {
            v.width = v.height = 30
            v.corners = 15
            v.backgroundColor = role === 'black' ? Color.BLACK : Color.WHITE
        })
        piece.centerX = (x + 1) * this.gap
        piece.centerY = (y + 1) * this.gap
        this.pieces.addChild(piece)
    }
}

class GoBangVM extends ViewModel<GoBangState, GoBangVH>{
    onAttached(state: GoBangState, vh: GoBangVH) {
        vh.actualBuild(state)
        vh.onPieceDown = (x, y) => {
            this.updateState(it => {
                if (it.role === 'black') {
                    it.matrix.set(x * count + y, State.BLACK)
                    it.role = 'white'
                } else {
                    it.matrix.set(x * count + y, State.WHITE)
                    it.role = 'black'
                }
            })
        }
    }

    onBind(state: GoBangState, vh: GoBangVH) {
        vh.pieces.children.length = 0
        for (let e of state.matrix.keys()) {
            const v = state.matrix.get(e)
            if (v === State.BLACK) {
                vh.addPiece(e, 'black')
            }
            switch (v) {
                case State.BLACK:
                    vh.addPiece(e, 'black')
                    break
                case State.WHITE:
                    vh.addPiece(e, 'white')
                    break
            }
        }
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
            gap: 40,
            role: "black",
            matrix: new Map
        }
    }
    getViewHolderClass() {
        return GoBangVH
    }
}