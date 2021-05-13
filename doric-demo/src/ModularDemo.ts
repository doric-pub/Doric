import { Color, Gravity, Group, layoutConfig, LayoutSpec, ModularPanel, Panel, scroller, text, vlayout } from "doric";
import { CounterPage } from "./Counter";

class Module1 extends Panel {
    build(root: Group) {
        vlayout(
            [
                text({
                    text: "First Module",
                    textColor: Color.WHITE,
                }),
            ],
            {
                layoutConfig: {
                    widthSpec: LayoutSpec.MOST,
                    heightSpec: LayoutSpec.FIT
                },
                padding: {
                    top: 20,
                    bottom: 20
                },
                gravity: Gravity.Center,
                backgroundColor: Color.parse("#3498db")
            }
        ).in(root)
    }
}

class Module2 extends Panel {
    build(root: Group) {
        vlayout(
            [
                text({
                    text: "Second Module",
                    textColor: Color.WHITE,
                }),
            ],
            {
                layoutConfig: {
                    widthSpec: LayoutSpec.MOST,
                    heightSpec: LayoutSpec.FIT
                },
                padding: {
                    top: 20,
                    bottom: 20
                },
                gravity: Gravity.Center,
                backgroundColor: Color.parse("#f39c12")
            }
        ).in(root)
    }
}

@Entry
class ModularDemo extends ModularPanel {
    setupModules() {
        return [
            Module1,
            Module2,
            CounterPage,
        ]
    }
    setupShelf(root: Group) {
        const shelf = vlayout(
            [],
            {
                layoutConfig: {
                    widthSpec: LayoutSpec.MOST,
                    heightSpec: LayoutSpec.FIT
                }
            }
        )
        scroller(
            shelf,
            {
                layoutConfig: layoutConfig().most()
            }).in(root)
        return shelf
    }

}