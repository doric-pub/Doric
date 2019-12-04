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
function box(idx = 0) {
    return (new doric.Stack).also(it => {
        it.width = it.height = 20;
        it.backgroundColor = colors[idx || 0];
    });
}
function title(str) {
    return doric.text({
        text: str,
        layoutConfig: doric.layoutConfig().w(doric.LayoutSpec.AT_MOST),
        textSize: 30,
        textColor: doric.Color.WHITE,
        backgroundColor: colors[1],
        textAlignment: doric.gravity().center(),
        height: 50,
    });
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function thisLabel(str) {
    return doric.text({
        text: str,
        width: 60,
        height: 50,
        backgroundColor: colors[0],
        textSize: 15,
        textColor: doric.Color.WHITE,
        layoutConfig: doric.layoutConfig().exactly(),
    });
}
let AnimatorDemo = class AnimatorDemo extends doric.Panel {
    build(rootView) {
        const view = box(2);
        view.onClick = () => {
            doric.modal(context).toast('Clicked');
        };
        const view2 = box(3);
        let idx = 0;
        doric.vlayout([
            title("Animator Demo"),
            doric.vlayout([
                doric.hlayout([
                    thisLabel('Reset').apply({
                        onClick: () => {
                            doric.animate(this)({
                                animations: () => {
                                    view.width = view.height = 20;
                                    view.x = view.y = 0;
                                    view.rotation = 0;
                                    view.backgroundColor = colors[2];
                                    view.corners = 0;
                                    view.scaleX = 1;
                                    view.scaleY = 1;
                                    view.translationX = 0;
                                    view.translationY = 0;
                                    view.rotation = 0;
                                },
                                duration: 1500,
                            }).then(() => {
                                doric.modal(context).toast('Fininshed');
                            }).catch(e => {
                                doric.modal(context).toast(`${e}`);
                            });
                        }
                    }),
                ]).apply({ space: 10 }),
                doric.hlayout([
                    thisLabel('X').apply({
                        onClick: () => {
                            doric.animate(this)({
                                animations: () => {
                                    view.x = view.x || 0;
                                    view.x += 100;
                                    view2.x += 50;
                                },
                                duration: 1000,
                            });
                        }
                    }),
                    thisLabel('Y').apply({
                        onClick: () => {
                            doric.animate(this)({
                                animations: () => {
                                    view.y = view.y || 0;
                                    view.y += 100;
                                    view2.y += 50;
                                },
                                duration: 1000,
                            });
                        }
                    }),
                    thisLabel('Width').apply({
                        onClick: () => {
                            doric.animate(this)({
                                animations: () => {
                                    view.width += 100;
                                },
                                duration: 1000,
                            });
                        }
                    }),
                    thisLabel('Height').apply({
                        onClick: () => {
                            doric.animate(this)({
                                animations: () => {
                                    view.height += 100;
                                },
                                duration: 1000,
                            });
                        }
                    }),
                ]).apply({ space: 10 }),
                doric.hlayout([
                    thisLabel('BgColor').apply({
                        onClick: () => {
                            doric.animate(this)({
                                animations: () => {
                                    view.backgroundColor = colors[(idx++) % colors.length];
                                },
                                duration: 1000,
                            });
                        }
                    }),
                    thisLabel('Rotation').apply({
                        onClick: () => {
                            doric.animate(this)({
                                animations: () => {
                                    if (view.rotation) {
                                        view.rotation += 0.5;
                                    }
                                    else {
                                        view.rotation = 0.5;
                                    }
                                },
                                duration: 1000,
                            });
                        }
                    }),
                    thisLabel('Corner').apply({
                        onClick: () => {
                            doric.animate(this)({
                                animations: () => {
                                    if (typeof view.corners === 'number') {
                                        view.corners += 10;
                                    }
                                    else {
                                        view.corners = 10;
                                    }
                                },
                                duration: 1000,
                            });
                        }
                    }),
                ]).apply({ space: 10 }),
                doric.hlayout([
                    thisLabel('scaleX').apply({
                        onClick: () => {
                            doric.animate(this)({
                                animations: () => {
                                    if (view.scaleX) {
                                        view.scaleX += 0.1;
                                    }
                                    else {
                                        view.scaleX = 1.1;
                                    }
                                },
                                duration: 1000,
                            });
                        }
                    }),
                    thisLabel('scaleY').apply({
                        onClick: () => {
                            doric.animate(this)({
                                animations: () => {
                                    if (view.scaleY) {
                                        view.scaleY += 0.1;
                                    }
                                    else {
                                        view.scaleY = 1.1;
                                    }
                                },
                                duration: 1000,
                            });
                        }
                    }),
                ]).apply({ space: 10 }),
            ]).apply({ space: 10 }),
            doric.stack([
                view,
            ]).apply({
                layoutConfig: doric.layoutConfig().atmost(),
                backgroundColor: colors[1].alpha(0.3 * 255),
            }),
        ]).apply({
            layoutConfig: doric.layoutConfig().atmost(),
            gravity: doric.gravity().center(),
            space: 10,
        }).in(rootView);
    }
};
AnimatorDemo = __decorate([
    Entry
], AnimatorDemo);
//# sourceMappingURL=AnimatorDemo.js.map
