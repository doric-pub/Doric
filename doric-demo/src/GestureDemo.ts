import { Group, Panel, gestureContainer, layoutConfig, Gravity, Color, stack, modal, scroller, vlayout, gravity, text, SwipeOrientation, } from "doric";
import { colors } from "./utils";

@Entry
class SimpleDemo extends Panel {
    build(rootView: Group) {
        let touchChild = stack([], {
            layoutConfig: layoutConfig().just(),
            width: 100,
            height: 100,
            backgroundColor: Color.WHITE,
        })

        let pinchChild = stack([], {
            layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
            width: 100,
            height: 100,
            backgroundColor: Color.WHITE,
        })

        let panChild = stack([], {
            layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
            width: 100,
            height: 100,
            backgroundColor: Color.WHITE,
        })

        let rotateChild = stack([], {
            layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
            width: 100,
            height: 100,
            backgroundColor: Color.WHITE,
        })

        scroller(
            vlayout([
                vlayout([
                    text({
                        text: "onTouch Demo",
                        layoutConfig: layoutConfig().mostWidth(),
                        textSize: 30,
                        textColor: Color.WHITE,
                        backgroundColor: colors[5],
                        textAlignment: gravity().center(),
                        height: 50,
                    }),
                    gestureContainer([
                        touchChild
                    ], {
                        onTouchDown: (event: { x: number, y: number }) => {
                            modal(context).toast("onTouchDown x=" + event.x + " y=" + event.y)
                        },
                        onTouchMove: (event: { x: number, y: number }) => {
                            touchChild.x = event.x - 50
                            touchChild.y = event.y - 50
                        },
                        onTouchUp: (event: { x: number, y: number }) => {
                            modal(context).toast("onTouchUp x=" + event.x + " y=" + event.y)
                        },
                        onTouchCancel: (event: { x: number, y: number }) => {
                            modal(context).toast("onTouchCancel x=" + event.x + " y=" + event.y)
                        }
                    }).apply({
                        layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                        width: 300,
                        height: 300,
                        backgroundColor: Color.BLACK
                    }),
                ]).apply({
                    layoutConfig: layoutConfig().mostWidth().fitHeight()
                }),


                vlayout([
                    text({
                        text: "SingleTap, DoubleTap, LongPress Demo",
                        layoutConfig: layoutConfig().mostWidth(),
                        textSize: 20,
                        textColor: Color.WHITE,
                        backgroundColor: colors[5],
                        textAlignment: gravity().center(),
                        height: 50,
                    }),
                    gestureContainer([], {
                        onSingleTap: () => {
                            modal(context).toast("onSingleTap")
                        },
                        onDoubleTap: () => {
                            modal(context).toast("onDoubleTap")
                        },
                        onLongPress: () => {
                            modal(context).toast("onLongPress")
                        }
                    }).apply({
                        layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                        width: 300,
                        height: 300,
                        backgroundColor: Color.BLACK
                    }),
                ]).apply({
                    layoutConfig: layoutConfig().mostWidth().fitHeight()
                }),


                vlayout([
                    text({
                        text: "Pinch Demo",
                        layoutConfig: layoutConfig().mostWidth(),
                        textSize: 30,
                        textColor: Color.WHITE,
                        backgroundColor: colors[5],
                        textAlignment: gravity().center(),
                        height: 50,
                    }),
                    gestureContainer([
                        pinchChild
                    ], {
                        onPinch: (scale: number) => {
                            pinchChild.width = 100 * scale
                            pinchChild.height = 100 * scale
                        },
                    }).apply({
                        layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                        width: 300,
                        height: 300,
                        backgroundColor: Color.BLACK
                    }),
                ]).apply({
                    layoutConfig: layoutConfig().mostWidth().fitHeight()
                }),


                vlayout([
                    text({
                        text: "Pan Demo",
                        layoutConfig: layoutConfig().mostWidth(),
                        textSize: 30,
                        textColor: Color.WHITE,
                        backgroundColor: colors[5],
                        textAlignment: gravity().center(),
                        height: 50,
                    }),
                    gestureContainer([
                        panChild
                    ], {
                        onPan: (dx: number, dy: number) => {
                            panChild.x -= dx
                            panChild.y -= dy
                        },
                    }).apply({
                        layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                        width: 300,
                        height: 300,
                        backgroundColor: Color.BLACK
                    }),
                ]).apply({
                    layoutConfig: layoutConfig().mostWidth().fitHeight()
                }),


                vlayout([
                    text({
                        text: "Rotate Demo",
                        layoutConfig: layoutConfig().mostWidth(),
                        textSize: 30,
                        textColor: Color.WHITE,
                        backgroundColor: colors[5],
                        textAlignment: gravity().center(),
                        height: 50,
                    }),
                    gestureContainer([
                        rotateChild
                    ], {
                        onRotate: (dAngle: number) => {
                            if (rotateChild.rotation == null) {
                                rotateChild.rotation = 0
                            }
                            rotateChild.rotation += dAngle
                        }
                    }).apply({
                        layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                        width: 300,
                        height: 300,
                        backgroundColor: Color.BLACK
                    })
                ]).apply({
                    layoutConfig: layoutConfig().mostWidth().fitHeight()
                }),


                vlayout([
                    text({
                        text: "Swipe Demo",
                        layoutConfig: layoutConfig().mostWidth(),
                        textSize: 30,
                        textColor: Color.WHITE,
                        backgroundColor: colors[5],
                        textAlignment: gravity().center(),
                        height: 50,
                    }),
                    gestureContainer([
                    ], {
                        onSwipe: (orientation) => {
                            if (orientation == SwipeOrientation.LEFT) {
                                modal(context).toast("onSwipeLeft")
                            } else if (orientation == SwipeOrientation.RIGHT) {
                                modal(context).toast("onSwipeRight")
                            } else if (orientation == SwipeOrientation.TOP) {
                                modal(context).toast("onSwipeTop")
                            } else if (orientation == SwipeOrientation.BOTTOM) {
                                modal(context).toast("onSwipeBottom")
                            }
                        }
                    }).apply({
                        layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                        width: 300,
                        height: 300,
                        backgroundColor: Color.BLACK
                    })
                ]).apply({
                    layoutConfig: layoutConfig().mostWidth().fitHeight()
                }),
            ], {
                space: 50,
                layoutConfig: layoutConfig().mostWidth().fitHeight(),
                gravity: gravity().centerX()
            }), { layoutConfig: layoutConfig().most(), }
        ).in(rootView)
    }
}