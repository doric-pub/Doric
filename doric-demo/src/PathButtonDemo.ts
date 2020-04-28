import { Panel, Group, LayoutSpec, layoutConfig, Color, vlayout, gravity, text, Gravity, animate, View, modal, stack } from "doric"
import { colors } from "./utils"

@Entry
class PathButtonDemo extends Panel {

    collapse: boolean = false
    dock?: View
    menu1?: View
    menu2?: View
    menu3?: View
    menu4?: View

    build(root: Group) {
        let clockWise = async () => {
            this.menu1?.let((it) => {
                it.scaleX = 0
                it.scaleY = 0
            })
            this.menu2?.let((it) => {
                it.scaleX = 0
                it.scaleY = 0
            })
            this.menu3?.let((it) => {
                it.scaleX = 0
                it.scaleY = 0
            })
            this.menu4?.let((it) => {
                it.scaleX = 0
                it.scaleY = 0
            })
            await animate(context)({
                animations: () => {
                    this.dock?.let((it) => {it.rotation = 0.5})
                    this.menu1?.let((it) => {
                        it.translationX = -150
                        it.scaleX = 1
                        it.scaleY = 1
                    })
                    this.menu2?.let((it) => {
                        it.translationY = -150
                        it.scaleX = 1
                        it.scaleY = 1
                    })
                    this.menu3?.let((it) => {
                        it.translationX = -150 * Math.cos(1/6 * Math.PI)
                        it.translationY = -150 * Math.sin(1/6 * Math.PI)
                        it.scaleX = 1
                        it.scaleY = 1
                    })
                    this.menu4?.let((it) => {
                        it.translationX = -150 * Math.cos(1/3 * Math.PI)
                        it.translationY = -150 * Math.sin(1/3 * Math.PI)
                        it.scaleX = 1
                        it.scaleY = 1
                    })
                },
                duration: 300,
            })
        }

        let antiClockWise = async () => {
            await animate(context)({
                animations: () => {
                    this.dock?.let((it) => {it.rotation = 0})
                    this.menu1?.let((it) => {
                        it.translationX = 0
                        it.scaleX = 0
                        it.scaleY = 0
                    })
                    this.menu2?.let((it) => {
                        it.translationY = 0
                        it.scaleX = 0
                        it.scaleY = 0
                    })
                    this.menu3?.let((it) => {
                        it.translationX = 0
                        it.translationY = 0
                        it.scaleX = 0
                        it.scaleY = 0
                    })
                    this.menu4?.let((it) => {
                        it.translationX = 0
                        it.translationY = 0
                        it.scaleX = 0
                        it.scaleY = 0
                    })
                },
                duration: 300,
            })
        }

        stack([
            this.menu1 = stack([], {
                width: 50,
                height: 50,
                layoutConfig: layoutConfig().just(),
                corners: 25,
                backgroundColor: Color.RED,
                x: Environment.screenWidth - 100,
                y: Environment.screenHeight - 140,
            }),
            this.menu2 = stack([], {
                width: 50,
                height: 50,
                layoutConfig: layoutConfig().just(),
                corners: 25,
                backgroundColor: Color.RED,
                x: Environment.screenWidth - 100,
                y: Environment.screenHeight - 140,
            }),
            this.menu3 = stack([], {
                width: 50,
                height: 50,
                layoutConfig: layoutConfig().just(),
                corners: 25,
                backgroundColor: Color.RED,
                x: Environment.screenWidth - 100,
                y: Environment.screenHeight - 140,
            }),
            this.menu4 = stack([], {
                width: 50,
                height: 50,
                layoutConfig: layoutConfig().just(),
                corners: 25,
                backgroundColor: Color.RED,
                x: Environment.screenWidth - 100,
                y: Environment.screenHeight - 140,
            }),
            this.dock = text({
                text: '+',
                textColor: Color.WHITE,
                textSize: 40,
                textAlignment: Gravity.Center,
                layoutConfig: layoutConfig().just(),
                backgroundColor: Color.RED,
                corners: 25,
                x: Environment.screenWidth - 100,
                y: Environment.screenHeight - 140,
                width: 50,
                height: 50,
                onClick: () => {
                    this.collapse = !this.collapse
                    if (this.collapse) {
                        clockWise()
                    } else {
                        antiClockWise()
                    }
                }
            }),
        ], {
            backgroundColor: colors[0],
            layoutConfig: layoutConfig().most(),
        }).in(root)
    }
}