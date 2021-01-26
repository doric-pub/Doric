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
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Corner"),
                    box().apply({
                        width: 100,
                        height: 100,
                        corners: 10,
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            bottom: 10
                        })
                    }),
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            bottom: 10
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
            ], { space: 20 }),
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            bottom: 10
                        })
                    }),
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            bottom: 10
                        })
                    }),
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
            ], { space: 20 }),
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 10,
                            right: 10,
                            bottom: 10,
                        })
                    }),
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 10,
                            right: 10,
                            bottom: 10,
                        })
                    }),
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 10,
                            right: 10,
                            bottom: 10,
                        })
                    }),
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 10,
                            right: 10,
                            bottom: 10,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
            ], { space: 20 }),
            doric.hlayout([
                doric.vlayout([
                    label("Corner round"),
                    box().apply({
                        width: 100,
                        height: 100,
                        corners: 50,
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
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
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
            ], { space: 20 }),
            doric.hlayout([
                doric.vlayout([
                    label("Gradient TOP_BOTTOM"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            start: colors[0],
                            end: doric.Color.WHITE,
                            orientation: doric.GradientOrientation.TOP_BOTTOM
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Gradient TR_BL"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            start: colors[0],
                            end: doric.Color.WHITE,
                            orientation: doric.GradientOrientation.TR_BL
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Gradient RIGHT_LEFT"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            start: colors[0],
                            end: doric.Color.WHITE,
                            orientation: doric.GradientOrientation.RIGHT_LEFT
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Gradient BR_TL"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            start: colors[0],
                            end: doric.Color.WHITE,
                            orientation: doric.GradientOrientation.BR_TL
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Gradient BOTTOM_TOP"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            start: colors[0],
                            end: doric.Color.WHITE,
                            orientation: doric.GradientOrientation.BOTTOM_TOP
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Gradient BL_TR"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            start: colors[0],
                            end: doric.Color.WHITE,
                            orientation: doric.GradientOrientation.BL_TR
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Gradient LEFT_RIGHT"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            start: colors[0],
                            end: doric.Color.WHITE,
                            orientation: doric.GradientOrientation.LEFT_RIGHT
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Gradient TL_BR"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            start: colors[0],
                            end: doric.Color.WHITE,
                            orientation: doric.GradientOrientation.TL_BR
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
            ], { space: 20 }),
            doric.hlayout([
                doric.vlayout([
                    label("Multi-Grad TOP_BOTTOM"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            colors: [colors[0], doric.Color.WHITE, colors[1]],
                            orientation: doric.GradientOrientation.TOP_BOTTOM
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Multi-Grad TR_BL"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            colors: [colors[0], doric.Color.WHITE, colors[1]],
                            orientation: doric.GradientOrientation.TR_BL
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Multi-Grad RIGHT_LEFT"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            colors: [colors[0], doric.Color.WHITE, colors[1]],
                            orientation: doric.GradientOrientation.RIGHT_LEFT
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Multi-Grad BR_TL"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            colors: [colors[0], doric.Color.WHITE, colors[1]],
                            orientation: doric.GradientOrientation.BR_TL
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Multi-Grad BOTTOM_TOP"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            colors: [colors[0], doric.Color.WHITE, colors[1]],
                            orientation: doric.GradientOrientation.BOTTOM_TOP
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Multi-Grad BL_TR"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            colors: [colors[0], doric.Color.WHITE, colors[1]],
                            orientation: doric.GradientOrientation.BL_TR
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Multi-Grad LEFT_RIGHT"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            colors: [colors[0], doric.Color.WHITE, colors[1]],
                            orientation: doric.GradientOrientation.LEFT_RIGHT
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
                doric.vlayout([
                    label("Multi-Grad TL_BR"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            colors: [colors[0], doric.Color.WHITE, colors[1]],
                            orientation: doric.GradientOrientation.TL_BR
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
            ], { space: 20 }),
            doric.hlayout([
                doric.vlayout([
                    label("Multi-Grad locations"),
                    box().apply({
                        width: 100,
                        height: 100,
                        backgroundColor: {
                            colors: [colors[0], doric.Color.WHITE, colors[1]],
                            locations: [0, 0.3, 1],
                            orientation: doric.GradientOrientation.TOP_BOTTOM
                        },
                        layoutConfig: doric.layoutConfig().just().configMargin({
                            left: 5,
                            right: 5,
                            bottom: 5,
                        })
                    }),
                ], {
                    gravity: doric.Gravity.Center,
                    space: 10,
                }),
            ], { space: 20 })
        ], {
            space: 20
        }), {
            layoutConfig: doric.layoutConfig().most()
        }).in(rootView);
    }
};
EffectsDemo = __decorate([
    Entry
], EffectsDemo);
//# sourceMappingURL=EffectsDemo.js.map
