import { Panel, scroller, vlayout, text, layoutConfig, LayoutSpec, Color, gravity, Group, navigator, modal } from "doric";
import { colors, label } from "./utils";
@Entry
class NaivgatorDemo extends Panel {
    build(root: Group) {
        if (this.getInitData()) {
            modal(context).alert(`Init Data :${JSON.stringify(this.getInitData())}`)
        }
        scroller(vlayout([
            text({
                text: "Navigator Demo",
                layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
                textSize: 30,
                textColor: Color.WHITE,
                backgroundColor: colors[1],
                textAlignment: gravity().center(),
                height: 50,
            }),
            ...[
                'NavbarDemo', "DraggableDemo",
                "RefreshableDemo",
                'Counter', 'EffectsDemo', 'ImageDemo', 'LayoutDemo',
                'ListDemo', 'ModalDemo', 'NavigatorDemo',
                'NetworkDemo', 'ScrollerDemo', 'SliderDemo', 'Snake', 'StorageDemo', 'PopoverDemo'].map(e =>
                    label(e).apply({
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just().configWidth(LayoutSpec.MOST),
                        onClick: () => {
                            navigator(context).push(`assets://src/${e}.js`, {
                                alias: `${e}.js`,
                                extra: {
                                    from: "navigatorDemo"
                                },
                            })
                        },
                    })
                ),
            label('POP').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    navigator(context).pop()
                },
            }),
            label('OpenURL').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    navigator(context).openUrl("https://doric.pub")
                },
            }),
        ]).apply({
            layoutConfig: {
                widthSpec: LayoutSpec.MOST,
                heightSpec: LayoutSpec.FIT
            },
            width: Environment.screenWidth,
            gravity: gravity().center(),
            space: 10,
        })).apply({
            layoutConfig: layoutConfig().most(),
        }).in(root)
    }

}