
import { Group, Panel, Text, text, gravity, Color, Stack, LayoutSpec, vlayout, hlayout, scroller, IVLayout, IHLayout, layoutConfig, Gravity } from "doric";
import { colors } from "./utils";


function box(idx = 0) {
    return (new Stack).also(it => {
        it.width = it.height = 20
        it.backgroundColor = colors[idx || 0]
    })
}

function boxStr(str: string, idx = 0) {
    return (new Text).also(it => {
        it.width = it.height = 20
        it.text = str
        it.textColor = Color.WHITE
        it.backgroundColor = colors[idx || 0]
    })
}

function label(str: string) {
    return text({
        text: str,
        textSize: 16,
    })
}

@Entry
class EffectsDemo extends Panel {
    build(rootView: Group) {
        scroller(
            vlayout([
                hlayout([
                    vlayout([
                        label("Origin view"),
                        box().apply({
                            width: 100,
                            height: 100
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Border"),
                        box().apply({
                            width: 100,
                            height: 100,
                            border: {
                                width: 5,
                                color: colors[3]
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 5,
                                right: 5,
                                bottom: 5,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Corner"),
                        box().apply({
                            width: 100,
                            height: 100,
                            corners: 10,
                            layoutConfig: layoutConfig().just().configMargin({
                                bottom: 10
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Shadow"),
                        box().apply({
                            width: 100,
                            height: 100,
                            shadow: {
                                opacity: 1,
                                color: colors[1],
                                offsetX: 3,
                                offsetY: 3,
                                radius: 5,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                bottom: 10
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                ]).apply({ space: 20 } as IHLayout),
                hlayout([
                    vlayout([
                        label("Border,Corner"),
                        box().apply({
                            width: 100,
                            height: 100,
                            border: {
                                width: 5,
                                color: colors[3]
                            },
                            corners: 10,
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 5,
                                right: 5,
                                bottom: 5,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Border,Shadow"),
                        box().apply({
                            width: 100,
                            height: 100,
                            border: {
                                width: 5,
                                color: colors[3]
                            },
                            shadow: {
                                opacity: 1,
                                color: colors[1],
                                offsetX: 3,
                                offsetY: 3,
                                radius: 5,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                bottom: 10
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Corner,Shadow"),
                        box().apply({
                            width: 100,
                            height: 100,
                            corners: 10,
                            shadow: {
                                opacity: 1,
                                color: colors[1],
                                offsetX: 3,
                                offsetY: 3,
                                radius: 5,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                bottom: 10
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Border,Corner,Shadow"),
                        box().apply({
                            width: 100,
                            height: 100,
                            border: {
                                width: 5,
                                color: colors[3]
                            },
                            corners: 10,
                            shadow: {
                                opacity: 1,
                                color: colors[1],
                                offsetX: 3,
                                offsetY: 3,
                                radius: 5,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 5,
                                right: 5,
                                bottom: 5,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                ]).apply({ space: 20 } as IHLayout),
                hlayout([
                    vlayout([
                        label("Shadow"),
                        box().apply({
                            width: 100,
                            height: 100,
                            corners: 50,
                            shadow: {
                                opacity: 1,
                                color: colors[1],
                                offsetX: 0,
                                offsetY: 0,
                                radius: 10,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 10,
                                right: 10,
                                bottom: 10,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Shadow,offset"),
                        box().apply({
                            width: 100,
                            height: 100,
                            corners: 50,
                            shadow: {
                                opacity: 1,
                                color: colors[1],
                                offsetX: 5,
                                offsetY: 5,
                                radius: 5,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 10,
                                right: 10,
                                bottom: 10,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Shadow,opacity"),
                        box().apply({
                            width: 100,
                            height: 100,
                            corners: 50,
                            shadow: {
                                opacity: 0.5,
                                color: colors[1],
                                offsetX: 5,
                                offsetY: 5,
                                radius: 5,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 10,
                                right: 10,
                                bottom: 10,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Shadow,color"),
                        box().apply({
                            width: 100,
                            height: 100,
                            corners: 50,
                            shadow: {
                                opacity: 1,
                                color: colors[2],
                                offsetX: 5,
                                offsetY: 5,
                                radius: 5,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 10,
                                right: 10,
                                bottom: 10,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                ]).apply({ space: 20 } as IHLayout),
                hlayout([
                    vlayout([
                        label("Corner round"),
                        box().apply({
                            width: 100,
                            height: 100,
                            corners: 50,
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 5,
                                right: 5,
                                bottom: 5,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Corner left top"),
                        box().apply({
                            width: 100,
                            height: 100,
                            corners: {
                                leftTop: 50,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 5,
                                right: 5,
                                bottom: 5,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Corner right top"),
                        box().apply({
                            width: 100,
                            height: 100,
                            corners: {
                                rightTop: 50,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 5,
                                right: 5,
                                bottom: 5,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Corner left bottom"),
                        box().apply({
                            width: 100,
                            height: 100,
                            corners: {
                                leftBottom: 50,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 5,
                                right: 5,
                                bottom: 5,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                    vlayout([
                        label("Corner right bottom"),
                        box().apply({
                            width: 100,
                            height: 100,
                            corners: {
                                rightBottom: 50,
                            },
                            layoutConfig: layoutConfig().just().configMargin({
                                left: 5,
                                right: 5,
                                bottom: 5,
                            })
                        }),]).apply({
                            gravity: Gravity.Center,
                            space: 10,
                        } as IVLayout),
                ]).apply({ space: 20 } as IHLayout),
            ]).also(it => {
                it.space = 20
            }),
        ).also(it => {
            it.layoutConfig = layoutConfig().most()
        }).in(rootView)
    }
}