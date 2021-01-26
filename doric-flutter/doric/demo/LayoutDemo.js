'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const colors = [
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
];
function box(idx = 0) {
    return doric.stack([], {
        width: 20,
        height: 20,
        layoutConfig: doric.layoutConfig().just(),
        backgroundColor: doric.Color.parse(colors[idx || 0])
    });
}
function boxStr(str, idx = 0) {
    return doric.text({
        width: 20,
        height: 20,
        text: str,
        textColor: doric.Color.WHITE,
        layoutConfig: doric.layoutConfig().just(),
        backgroundColor: doric.Color.parse(colors[idx || 0])
    });
}
function label(str) {
    return doric.text({
        text: str,
        textSize: 16,
    });
}
let LayoutDemo = class LayoutDemo extends doric.Panel {
    build(rootView) {
        doric.scroller(doric.hlayout([
            doric.vlayout([
                label("Horizontal Layout(Align to Top)"),
                doric.hlayout([
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
                ], {
                    space: 20
                }),
                label("Horizontal Layout(Align to Bottom)"),
                doric.hlayout([
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
                ], {
                    space: 20,
                    gravity: doric.Gravity.Bottom
                }),
                label("Horizontal Layout(Align to Center)"),
                doric.hlayout([
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
                ], {
                    space: 20,
                    gravity: doric.Gravity.Center
                }),
                label("Horizontal Layout(Weight)"),
                doric.hlayout([
                    boxStr('weight=1', 3).apply({
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                            weight: 1,
                        }
                    }),
                    box(2),
                    box(4),
                ], {
                    width: 200,
                    height: 30,
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.JUST,
                        heightSpec: doric.LayoutSpec.JUST,
                    },
                    backgroundColor: doric.Color.parse('#eeeeee'),
                    gravity: doric.gravity().center(),
                }),
                doric.hlayout([
                    box(3),
                    boxStr('weight=1', 2).apply({
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                            weight: 1,
                        }
                    }),
                    box(4),
                ], {
                    width: 200,
                    height: 30,
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.JUST,
                        heightSpec: doric.LayoutSpec.JUST,
                    },
                    backgroundColor: doric.Color.parse('#eeeeee'),
                    gravity: doric.gravity().center(),
                }),
                doric.hlayout([
                    box(3),
                    box(2),
                    boxStr('weight=1', 4).apply({
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                            weight: 1,
                        }
                    }),
                ], {
                    width: 200,
                    height: 30,
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.JUST,
                        heightSpec: doric.LayoutSpec.JUST,
                    },
                    backgroundColor: doric.Color.parse('#eeeeee'),
                    gravity: doric.gravity().center(),
                }),
                doric.hlayout([
                    boxStr('weight=1', 3).apply({
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                            weight: 1,
                        }
                    }),
                    boxStr('weight=1', 2).apply({
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                            weight: 1,
                        }
                    }),
                    box(4),
                ], {
                    width: 200,
                    height: 30,
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.JUST,
                        heightSpec: doric.LayoutSpec.JUST,
                    },
                    backgroundColor: doric.Color.parse('#eeeeee'),
                    gravity: doric.gravity().center(),
                }),
                doric.hlayout([
                    boxStr('weight=1', 3).apply({
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                            weight: 1,
                        }
                    }),
                    boxStr('weight=1', 2).apply({
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                            weight: 1,
                        }
                    }),
                    boxStr('weight=1', 4).apply({
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                            weight: 1,
                        }
                    }),
                ], {
                    width: 200,
                    height: 30,
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.JUST,
                        heightSpec: doric.LayoutSpec.JUST,
                    },
                    backgroundColor: doric.Color.parse('#eeeeee'),
                    gravity: doric.gravity().center(),
                }),
            ], {
                space: 20,
                gravity: doric.Gravity.Center
            }),
            doric.vlayout([
                label("Vertical Layout(Algin to Left)"),
                doric.vlayout([
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
                ], {
                    space: 20
                }),
                label("Vertical Layout(Algin to Right)"),
                doric.vlayout([
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
                ], {
                    space: 20,
                    gravity: doric.gravity().right(),
                }),
                label("Vertical Layout(Algin to Center)"),
                doric.vlayout([
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
                ], {
                    space: 20,
                    gravity: doric.gravity().center(),
                }),
                label("Vertical Layout(Weight)"),
                doric.hlayout([
                    doric.vlayout([
                        boxStr('weight=1', 3).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                                weight: 1,
                            },
                        }),
                        box(2).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                            }
                        }),
                        box(4).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                            }
                        }),
                    ], {
                        width: 100,
                        height: 200,
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                        },
                        backgroundColor: doric.Color.parse('#eeeeee'),
                        gravity: doric.gravity().center(),
                    }),
                    doric.vlayout([
                        box(3).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                            },
                        }),
                        boxStr('weight=1', 2).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                                weight: 1,
                            }
                        }),
                        box(4).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                            }
                        }),
                    ], {
                        width: 100,
                        height: 200,
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                        },
                        backgroundColor: doric.Color.parse('#eeeeee'),
                        gravity: doric.gravity().center(),
                    }),
                    doric.vlayout([
                        box(3).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                            },
                        }),
                        box(2).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                            },
                        }),
                        boxStr('weight=1', 4).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                                weight: 1,
                            }
                        }),
                    ], {
                        width: 100,
                        height: 200,
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                        },
                        backgroundColor: doric.Color.parse('#eeeeee'),
                        gravity: doric.gravity().center(),
                    }),
                    doric.vlayout([
                        boxStr('weight=1', 3).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                                weight: 1,
                            },
                        }),
                        boxStr('weight=1', 2).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                                weight: 1,
                            }
                        }),
                        box(4).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                            }
                        }),
                    ], {
                        width: 100,
                        height: 200,
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                        },
                        backgroundColor: doric.Color.parse('#eeeeee'),
                        gravity: doric.gravity().center(),
                    }),
                    doric.vlayout([
                        boxStr('weight=1', 3).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                                weight: 1,
                            },
                        }),
                        boxStr('weight=1', 2).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                                weight: 1,
                            }
                        }),
                        boxStr('weight=1', 4).apply({
                            layoutConfig: {
                                widthSpec: doric.LayoutSpec.MOST,
                                heightSpec: doric.LayoutSpec.JUST,
                                weight: 1,
                            }
                        }),
                    ], {
                        width: 100,
                        height: 200,
                        layoutConfig: {
                            widthSpec: doric.LayoutSpec.JUST,
                            heightSpec: doric.LayoutSpec.JUST,
                        },
                        backgroundColor: doric.Color.parse('#eeeeee'),
                        gravity: doric.gravity().center(),
                    }),
                ], {
                    space: 20
                }),
            ], {
                space: 20,
                gravity: doric.Gravity.Left
            })
        ], {
            space: 20
        }), {
            layoutConfig: doric.layoutConfig().most()
        }).in(rootView);
    }
};
LayoutDemo = __decorate([
    Entry
], LayoutDemo);
//# sourceMappingURL=LayoutDemo.js.map
