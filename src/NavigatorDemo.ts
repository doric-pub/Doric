import { Panel, scroller, vlayout, text, layoutConfig, LayoutSpec, Color, gravity, IVLayout, Group, IText, navigator } from "doric";
import { colors, label } from "./utils";
@Entry
class NaivgatorDemo extends Panel {
    build(root: Group) {
        scroller(vlayout([
            text({
                text: "Navigator Demo",
                layoutConfig: layoutConfig().w(LayoutSpec.AT_MOST),
                textSize: 30,
                textColor: Color.WHITE,
                backgroundColor: colors[1],
                textAlignment: gravity().center(),
                height: 50,
            }),
            ...[
                'NavbarDemo',
                'Counter', 'EffectsDemo', 'ImageDemo', 'LayoutDemo',
                'ListDemo', 'ModalDemo', 'NavigatorDemo',
                'NetworkDemo', 'ScrollerDemo', 'SliderDemo', 'Snake', 'StorageDemo'].map(e =>
                    label(e).apply({
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().exactly().w(LayoutSpec.AT_MOST),
                        onClick: () => {
                            navigator(context).push(`assets://demo/${e}.js`, `${e}.js`)
                        },
                    } as IText)
                ),
            label('POP').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
                onClick: () => {
                    navigator(context).pop()
                },
            } as IText),
        ]).apply({
            layoutConfig: layoutConfig().atmost().h(LayoutSpec.WRAP_CONTENT),
            gravity: gravity().center(),
            space: 10,
        } as IVLayout)).apply({
            layoutConfig: layoutConfig().atmost(),
        }).in(root)
    }

}