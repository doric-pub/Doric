import { Module, Color, Gravity, Group, layoutConfig, LayoutSpec, ModularPanel, scroller, text, vlayout, hlayout, Text, HLayout, View, VLayout, Provider, stack, loge, } from "doric";
import { CounterPage } from "./Counter";

let moduleId = 0

class ProvidedData {
    received: string[] = []
    mounted: Record<string, boolean> = {}
}

class SingleModule extends Module {
    myId = ++moduleId

    onCreate() {
        super.onCreate()
        this.provider?.observe(ProvidedData).addObserver((state => {
            if (state?.mounted[this.name()] === false) {
                this.unmount()
            } else {
                this.mount()
            }
        }))
    }

    name() {
        return `${this.constructor.name}#${this.myId}`
    }

    discription() {
        return "This is a single module."
    }

    backgroundColor() {
        return Color.parse("#3498db")
    }

    contentView!: View

    buildExtraContent(): View[] {
        return []
    }
    build(root: Group) {
        this.contentView = vlayout(
            [
                text({
                    text: this.name(),
                    textColor: Color.WHITE,
                    textSize: 20,
                    onClick: () => {
                        this.dispatchMessage(`Hello from ${this.name()}`)
                        this.provider?.observe(ProvidedData)?.update(state => {
                            state?.received.push(this.name())
                            return state
                        })
                    }
                }),
                text({
                    textSize: 12,
                    text: this.discription(),
                    textColor: Color.WHITE,
                }),
                text({
                    text: "Unmount",
                    textSize: 12,
                    textColor: Color.WHITE,
                    onClick: () => {
                        this.provider?.observe(ProvidedData)?.update(state => {
                            if (state) {
                                state.mounted[this.name()] = false
                            }
                            return state
                        })
                    }
                }),
                ...this.buildExtraContent(),
            ],
            {
                layoutConfig: {
                    widthSpec: LayoutSpec.MOST,
                    heightSpec: LayoutSpec.FIT,
                },
                padding: {
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20,
                },
                gravity: Gravity.Center,
                backgroundColor: this.backgroundColor(),
                space: 5,
            }
        ).in(root)
    }
}

abstract class GroupModule extends ModularPanel {
    myId = ++moduleId

    name() {
        return `${this.constructor.name}#${this.myId}`
    }

    discription() {
        return "This is a group module."
    }

    backgroundColor() {
        return Color.parse("#f39c12")
    }

    abstract buildShelf(): [View, Group]

    setupShelf(root: Group): Group {
        const [content, shelf] = this.buildShelf()
        vlayout(
            [
                text({
                    text: this.name(),
                    textColor: Color.WHITE,
                    textSize: 20,
                    onClick: () => {
                        this.dispatchMessage(`Hello from ${this.name()}`)
                        this.provider?.observe(ProvidedData)?.update(state => {
                            state?.received.push(this.name())
                            return state
                        })
                    }
                }),
                text({
                    textSize: 12,
                    text: this.discription(),
                    textColor: Color.WHITE,
                }),
                content
            ],
            {
                layoutConfig: {
                    widthSpec: LayoutSpec.MOST,
                    heightSpec: LayoutSpec.FIT
                },
                backgroundColor: this.backgroundColor(),
                padding: {
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

class Receiver extends SingleModule {
    contentLabel?: Text

    discription() {
        return "This module recevies message from other modules."
    }

    buildExtraContent() {
        return [
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
        ]
    }

    onMessage(message: string) {
        this.contentLabel!.text = message
    }
}


class ProviderWatcher extends SingleModule {
    contentLabel?: Text

    discription() {
        return "This module watches provider."
    }

    onCreate() {
        super.onCreate()
        this.provider?.observe(ProvidedData)?.addObserver((ret) => {
            this.contentLabel!.text = ret?.received?.join("\n")
        })
    }

    buildExtraContent() {
        return [
            hlayout(
                [
                    text({
                        text: "Clicked:",
                        textColor: Color.WHITE,
                    }),
                    this.contentLabel = text({
                        text: "",
                        maxLines: 0,
                        textColor: Color.WHITE,
                    }),
                ],
                {
                    space: 10
                })
        ]
    }
}


class InnerSingleModule extends SingleModule {
    build(root: Group) {
        super.build(root)
        this.contentView.apply({
            layoutConfig: {
                widthSpec: LayoutSpec.MOST,
                heightSpec: LayoutSpec.FIT,
                weight: 1,
            }
        })
    }
}

class HorizontalModule extends GroupModule {
    discription() {
        return "This module is horizontal."
    }
    buildShelf(): [View, Group] {
        const shelf = new HLayout
        shelf.apply({
            layoutConfig: {
                widthSpec: LayoutSpec.MOST,
                heightSpec: LayoutSpec.FIT
            },
            space: 10,
        })
        return [
            shelf,
            shelf,
        ]
    }
    setupModules() {
        return [
            InnerSingleModule,
            InnerSingleModule,
        ]
    }
}


class VerticalModule extends GroupModule {
    discription() {
        return "This module is vertical."
    }
    backgroundColor() {
        return Color.parse("#2ecc71")
    }
    buildShelf(): [View, Group] {
        const shelf = new VLayout
        shelf.apply({
            layoutConfig: {
                widthSpec: LayoutSpec.MOST,
                heightSpec: LayoutSpec.JUST
            },
            height: 120,
            space: 10,
        })
        return [
            shelf,
            shelf,
        ]
    }
    setupModules() {
        return [
            InnerSingleModule,
            InnerSingleModule,
        ]
    }
}

class ScrollableVerticalModule extends GroupModule {
    discription() {
        return "This module is vertical and scrollable."
    }
    backgroundColor() {
        return Color.parse("#2ecc71")
    }
    buildShelf(): [View, Group] {
        const shelf = new VLayout
        shelf.apply({
            layoutConfig: {
                widthSpec: LayoutSpec.MOST,
                heightSpec: LayoutSpec.FIT
            },
            space: 10,
        })
        return [
            scroller(
                shelf,
                {
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.JUST,
                    },
                    height: 120,
                }),
            shelf,
        ]
    }
    setupModules() {
        return [
            SingleModule,
            SingleModule,
            SingleModule,
            SingleModule,
        ]
    }
    onCreate() {
        this.provider?.remove(ProvidedData)
    }
}

class ScrollableHorizontalModule extends GroupModule {
    discription() {
        return "This module is horizontal and scrollable."
    }
    buildShelf(): [View, Group] {
        const shelf = new HLayout
        shelf.apply({
            layoutConfig: {
                widthSpec: LayoutSpec.FIT,
                heightSpec: LayoutSpec.FIT
            },
            space: 10,
        })
        return [
            scroller(
                shelf,
                {
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.FIT
                    },
                }),
            shelf,
        ]
    }

    setupModules() {
        return [
            SingleModule,
            SingleModule,
            SingleModule,
            SingleModule,
            SingleModule,
        ]
    }
}


class ResetModule extends SingleModule {
    discription() {
        return "This module reset all modules to mounted."
    }

    buildExtraContent() {
        return [
            text({
                text: "Reset",
                textColor: Color.WHITE,
                onClick: () => {
                    this.provider?.observe(ProvidedData).update(state => {
                        if (state) {
                            state.mounted = {}
                        }
                        return state
                    })
                },
            })
        ]
    }
}

@Entry
class ModularDemo extends ModularPanel {

    constructor() {
        super()
        this.provider = new Provider
        this.provider.provide(new ProvidedData)
    }

    setupModules() {
        return [
            SingleModule,
            ProviderWatcher,
            Receiver,
            VerticalModule,
            HorizontalModule,
            ScrollableVerticalModule,
            ScrollableHorizontalModule,
            CounterPage,
            ResetModule,
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