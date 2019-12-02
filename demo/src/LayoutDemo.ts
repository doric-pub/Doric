
import { Group, Panel, Text, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, slider, slideItem, scroller, IVLayout, IHLayout, layoutConfig } from "doric";
import { O_TRUNC } from "constants";

const colors = [
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
]

function box(idx = 0) {
    return (new Stack).also(it => {
        it.width = it.height = 20
        it.backgroundColor = Color.parse(colors[idx || 0])
    })
}
function boxStr(str: string, idx = 0) {
    return (new Text).also(it => {
        it.width = it.height = 20
        it.text = str
        it.textColor = Color.parse('#ffffff')
        it.backgroundColor = Color.parse(colors[idx || 0])
    })
}
function label(str: string) {
    return text({
        text: str,
        textSize: 16,
    })
}
@Entry
class LayoutDemo extends Panel {
    build(rootView: Group) {
        scroller(
            hlayout([
                vlayout([
                    label("Horizontal Layout(Align to Top)"),
                    hlayout([
                        box().apply({
                            height: 20
                        }),
                        box().apply({
                            height: 40
                        }),
                        box().apply({
                            height: 60
                        }),
                        box().apply({
                            height: 40
                        }),
                        box().apply({
                            height: 20
                        }),
                    ]).also(it => {
                        it.space = 20
                    }),
                    label("Horizontal Layout(Align to Bottom)"),
                    hlayout([
                        box().apply({
                            height: 20
                        }),
                        box().apply({
                            height: 40
                        }),
                        box().apply({
                            height: 60
                        }),
                        box().apply({
                            height: 40
                        }),
                        box().apply({
                            height: 20
                        }),
                    ]).also(it => {
                        it.space = 20
                        it.gravity = gravity().bottom()
                    }),
                    label("Horizontal Layout(Align to Center)"),
                    hlayout([
                        box().apply({
                            height: 20
                        }),
                        box().apply({
                            height: 40
                        }),
                        box().apply({
                            height: 60
                        }),
                        box().apply({
                            height: 40
                        }),
                        box().apply({
                            height: 20
                        }),
                    ]).also(it => {
                        it.space = 20
                        it.gravity = gravity().center()
                    }),
                    label("Horizontal Layout(Weight)"),
                    hlayout([
                        boxStr('weight=1', 3).apply({
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                                weight: 1,
                            }
                        }),
                        box(2),
                        box(4),
                    ]).apply({
                        width: 200,
                        height: 30,
                        layoutConfig: {
                            widthSpec: LayoutSpec.EXACTLY,
                            heightSpec: LayoutSpec.EXACTLY,
                        },
                        backgroundColor: Color.parse('#eeeeee'),
                        gravity: gravity().center(),
                    } as IHLayout),
                    hlayout([
                        box(3),
                        boxStr('weight=1', 2).apply({
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                                weight: 1,
                            }
                        }),
                        box(4),
                    ]).apply({
                        width: 200,
                        height: 30,
                        layoutConfig: {
                            widthSpec: LayoutSpec.EXACTLY,
                            heightSpec: LayoutSpec.EXACTLY,
                        },
                        backgroundColor: Color.parse('#eeeeee'),
                        gravity: gravity().center(),
                    } as IHLayout),
                    hlayout([
                        box(3),
                        box(2),
                        boxStr('weight=1', 4).apply({
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                                weight: 1,
                            }
                        }),
                    ]).apply({
                        width: 200,
                        height: 30,
                        layoutConfig: {
                            widthSpec: LayoutSpec.EXACTLY,
                            heightSpec: LayoutSpec.EXACTLY,
                        },
                        backgroundColor: Color.parse('#eeeeee'),
                        gravity: gravity().center(),
                    } as IHLayout),
                    hlayout([
                        boxStr('weight=1', 3).apply({
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                                weight: 1,
                            }
                        }),
                        boxStr('weight=1', 2).apply({
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                                weight: 1,
                            }
                        }),
                        box(4),
                    ]).apply({
                        width: 200,
                        height: 30,
                        layoutConfig: {
                            widthSpec: LayoutSpec.EXACTLY,
                            heightSpec: LayoutSpec.EXACTLY,
                        },
                        backgroundColor: Color.parse('#eeeeee'),
                        gravity: gravity().center(),
                    } as IHLayout),
                    hlayout([
                        boxStr('weight=1', 3).apply({
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                                weight: 1,
                            }
                        }),
                        boxStr('weight=1', 2).apply({
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                                weight: 1,
                            }
                        }),
                        boxStr('weight=1', 4).apply({
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                                weight: 1,
                            }
                        }),
                    ]).apply({
                        width: 200,
                        height: 30,
                        layoutConfig: {
                            widthSpec: LayoutSpec.EXACTLY,
                            heightSpec: LayoutSpec.EXACTLY,
                        },
                        backgroundColor: Color.parse('#eeeeee'),
                        gravity: gravity().center(),
                    } as IHLayout),
                ]).also(it => {
                    it.space = 20
                    it.gravity = gravity().center()
                }),
                vlayout([
                    label("Vertical Layout(Algin to Left)"),
                    vlayout([
                        box(1).apply({
                            width: 20
                        }),
                        box(1).apply({
                            width: 40
                        }),
                        box(1).apply({
                            width: 60
                        }),
                        box(1).apply({
                            width: 40
                        }),
                        box(1).apply({
                            width: 20
                        }),
                    ]).apply({
                        space: 20
                    } as IVLayout),
                    label("Vertical Layout(Algin to Right)"),
                    vlayout([
                        box(1).apply({
                            width: 20
                        }),
                        box(1).apply({
                            width: 40
                        }),
                        box(1).apply({
                            width: 60
                        }),
                        box(1).apply({
                            width: 40
                        }),
                        box(1).apply({
                            width: 20
                        }),
                    ]).apply({
                        space: 20,
                        gravity: gravity().right(),
                    } as IVLayout),
                    label("Vertical Layout(Algin to Center)"),
                    vlayout([
                        box(1).apply({
                            width: 20
                        }),
                        box(1).apply({
                            width: 40
                        }),
                        box(1).apply({
                            width: 60
                        }),
                        box(1).apply({
                            width: 40
                        }),
                        box(1).apply({
                            width: 20
                        }),
                    ]).apply({
                        space: 20,
                        gravity: gravity().center(),
                    } as IVLayout),
                    label("Vertical Layout(Weight)"),
                    hlayout([

                        vlayout([
                            boxStr('weight=1', 3).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                    weight: 1,
                                },
                            }),
                            box(2).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                }
                            }),
                            box(4).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                }
                            }),
                        ]).apply({
                            width: 100,
                            height: 200,
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                            },
                            backgroundColor: Color.parse('#eeeeee'),
                            gravity: gravity().center(),
                        } as IVLayout),
                        vlayout([
                            box(3).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                },
                            }),
                            boxStr('weight=1', 2).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                    weight: 1,
                                }
                            }),
                            box(4).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                }
                            }),
                        ]).apply({
                            width: 100,
                            height: 200,
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                            },
                            backgroundColor: Color.parse('#eeeeee'),
                            gravity: gravity().center(),
                        } as IVLayout),
                        vlayout([
                            box(3).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                },
                            }),
                            box(2).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                },
                            }),
                            boxStr('weight=1', 4).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                    weight: 1,
                                }
                            }),
                        ]).apply({
                            width: 100,
                            height: 200,
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                            },
                            backgroundColor: Color.parse('#eeeeee'),
                            gravity: gravity().center(),
                        } as IVLayout),
                        vlayout([
                            boxStr('weight=1', 3).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                    weight: 1,
                                },
                            }),
                            boxStr('weight=1', 2).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                    weight: 1,
                                }
                            }),
                            box(4).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                }
                            }),
                        ]).apply({
                            width: 100,
                            height: 200,
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                            },
                            backgroundColor: Color.parse('#eeeeee'),
                            gravity: gravity().center(),
                        } as IVLayout),
                        vlayout([
                            boxStr('weight=1', 3).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                    weight: 1,
                                },
                            }),
                            boxStr('weight=1', 2).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                    weight: 1,
                                }
                            }),
                            boxStr('weight=1', 4).apply({
                                layoutConfig: {
                                    widthSpec: LayoutSpec.AT_MOST,
                                    heightSpec: LayoutSpec.EXACTLY,
                                    weight: 1,
                                }
                            }),
                        ]).apply({
                            width: 100,
                            height: 200,
                            layoutConfig: {
                                widthSpec: LayoutSpec.EXACTLY,
                                heightSpec: LayoutSpec.EXACTLY,
                            },
                            backgroundColor: Color.parse('#eeeeee'),
                            gravity: gravity().center(),
                        } as IVLayout),
                    ]).also(it => {
                        it.space = 20
                    }),

                ]).also(it => {
                    it.space = 20
                    it.gravity = gravity().left()
                })
            ]).also(it => {
                it.space = 20
            }),
        ).also(it => {
            it.layoutConfig = layoutConfig().atmost()
        })
            .in(rootView)
    }
}