import { Module, Color, Gravity, Group, layoutConfig, LayoutSpec, ModularPanel, Panel, scroller, text, vlayout, modal, hlayout, Text, ClassType, HLayout } from "doric";
import { CounterPage } from "./Counter";

class Module1 extends Module {
    build(root: Group) {
        vlayout(
            [
                text({
                    text: "First Module",
                    textColor: Color.WHITE,
                    onClick: () => {
                        this.dispatchMessage("Hello from First Module")
                    }
                }),
                text({
                    text: "Send",
                    textColor: Color.WHITE,
                    onClick: async () => {
                        const text = await modal(context).prompt({
                            title: "Send something",
                        })
                        this.dispatchMessage(text)
                    },
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
                backgroundColor: Color.parse("#3498db"),
                space: 20,
            }
        ).in(root)
    }
}

class Module2 extends Module {
    contentLabel?: Text
    build(root: Group) {
        vlayout(
            [
                text({
                    text: "Second Module",
                    textColor: Color.WHITE,
                    onClick: () => {
                        this.dispatchMessage("Hello from Second Module")
                    }
                }),
                hlayout(
                    [
                        text({
                            text: "Received:",
                            textColor: Color.WHITE,
                        }),
                        this.contentLabel = text({
                            text: "",
                            textColor: Color.WHITE,
                        }),
                    ],
                    {
                        space: 10
                    })
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
                space: 20,
                gravity: Gravity.Center,
                backgroundColor: Color.parse("#f39c12")
            }
        ).in(root)
    }

    onMessage(message: string) {
        this.contentLabel!.text = message
    }
}

class Module3 extends Module {
    build(root: Group) {
        vlayout(
            [
                text({
                    text: "Third Module",
                    textColor: Color.WHITE,
                    onClick: () => {
                        this.dispatchMessage("Hello from Third Module")
                    }
                }),
            ],
            {
                layoutConfig: {
                    widthSpec: LayoutSpec.FIT,
                    heightSpec: LayoutSpec.FIT,
                },
                padding: {
                    top: 20,
                    bottom: 20
                },
                gravity: Gravity.Center,
                backgroundColor: Color.parse("#2ecc71"),
                space: 20,
            }
        ).in(root)
    }
}

class Module4 extends Module {
    build(root: Group) {
        vlayout(
            [
                text({
                    text: "Fourth Module",
                    textColor: Color.WHITE,
                    onClick: () => {
                        this.dispatchMessage("Hello from Fourth Module")
                    }
                }),
            ],
            {
                layoutConfig: {
                    widthSpec: LayoutSpec.FIT,
                    heightSpec: LayoutSpec.FIT
                },
                padding: {
                    top: 20,
                    bottom: 20
                },
                gravity: Gravity.Center,
                backgroundColor: Color.parse("#e74c3c"),
                space: 20,
            }
        ).in(root)
    }
}



class Module5 extends ModularPanel {
    setupModules() {
        return [
            Module3,
            Module4,
            Module3,
            Module4,
            Module3,
            Module4,
        ]
    }
    setupShelf(root: Group): Group {
        const shelf = new HLayout
        shelf.apply({
            layoutConfig: {
                widthSpec: LayoutSpec.FIT,
                heightSpec: LayoutSpec.FIT
            },
            space: 10,
        })
        vlayout(
            [
                text({
                    text: "Fifth Module",
                    textColor: Color.WHITE,
                    onClick: () => {
                        this.dispatchMessage("Hello from Fifth Module")
                    }
                }),
                scroller(
                    shelf,
                    {
                        layoutConfig: {
                            widthSpec: LayoutSpec.MOST,
                            heightSpec: LayoutSpec.FIT
                        },
                    })
            ],
            {
                layoutConfig: {
                    widthSpec: LayoutSpec.MOST,
                    heightSpec: LayoutSpec.FIT
                },
                backgroundColor: Color.parse("#9b59b6"),
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                },
                space: 10,
                gravity: Gravity.Center,
            }
        ).in(root)
        return shelf
    }
}

@Entry
class ModularDemo extends ModularPanel {
    setupModules() {
        return [
            Module1,
            Module2,
            Module5,
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
                },
                space: 10,
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