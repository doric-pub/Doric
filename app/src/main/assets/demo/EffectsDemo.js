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
function box(idx = 0) {
    return (new doric.Stack).also(it => {
        it.width = it.height = 20;
        it.backgroundColor = colors[idx || 0];
    });
}
function label(str) {
    return doric.text({
        text: str,
        textSize: 16,
    });
}
let EffectsDemo = class EffectsDemo extends doric.Panel {
    build(rootView) {
        doric.scroller(doric.vlayout([
            doric.hlayout([
                doric.vlayout([
                    label("Origin view"),
                    box().apply({
                        width: 100,
                        height: 100
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Border"),
                    box().apply({
                        width: 100,
                        height: 100,
                        border: {
                            width: 5,
                            color: colors[3]
                        },
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Corner"),
                    box().apply({
                        width: 100,
                        height: 100,
                        corners: 10,
                        layoutConfig: doric.layoutConfig().exactly().m({
                            bottom: 10
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
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
                        layoutConfig: doric.layoutConfig().exactly().m({
                            bottom: 10
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
            ]).apply({ space: 20 }),
            doric.hlayout([
                doric.vlayout([
                    label("Border,Corner"),
                    box().apply({
                        width: 100,
                        height: 100,
                        border: {
                            width: 5,
                            color: colors[3]
                        },
                        corners: 10,
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
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
                        layoutConfig: doric.layoutConfig().exactly().m({
                            bottom: 10
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
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
                        layoutConfig: doric.layoutConfig().exactly().m({
                            bottom: 10
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
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
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
            ]).apply({ space: 20 }),
            doric.hlayout([
                doric.vlayout([
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
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 10,
                            right: 10,
                            bottom: 10,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
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
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 10,
                            right: 10,
                            bottom: 10,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
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
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 10,
                            right: 10,
                            bottom: 10,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
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
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 10,
                            right: 10,
                            bottom: 10,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
            ]).apply({ space: 20 }),
            doric.hlayout([
                doric.vlayout([
                    label("Corner round"),
                    box().apply({
                        width: 100,
                        height: 100,
                        corners: 50,
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Corner left top"),
                    box().apply({
                        width: 100,
                        height: 100,
                        corners: {
                            leftTop: 50,
                        },
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Corner right top"),
                    box().apply({
                        width: 100,
                        height: 100,
                        corners: {
                            rightTop: 50,
                        },
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Corner left bottom"),
                    box().apply({
                        width: 100,
                        height: 100,
                        corners: {
                            leftBottom: 50,
                        },
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Corner right bottom"),
                    box().apply({
                        width: 100,
                        height: 100,
                        corners: {
                            rightBottom: 50,
                        },
                        layoutConfig: doric.layoutConfig().exactly().m({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ]).apply({
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
            ]).apply({ space: 20 }),
        ]).also(it => {
            it.space = 20;
        })).also(it => {
            it.layoutConfig = doric.layoutConfig().atmost();
        }).in(rootView);
    }
};
EffectsDemo = __decorate([
    Entry
], EffectsDemo);
//# sourceMappingURL=EffectsDemo.js.map
