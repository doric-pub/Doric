import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, slider, slideItem } from "doric";
const colors = [
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
]
@Entry
class SliderPanel extends Panel {
    build(rootView: Group): void {
        rootView.addChild(vlayout([
            text({
                text: "SliderDemo",
                layoutConfig: {
                    widthSpec: LayoutSpec.AT_MOST,
                    heightSpec: LayoutSpec.EXACTLY,
                },
                textSize: 30,
                textColor: Color.parse("#535c68"),
                bgColor: Color.parse("#dff9fb"),
                textAlignment: gravity().center(),
                height: 50,
            }),
            slider({
                itemCount: 3,
                renderPage: (idx) => {
                    return slideItem(text({
                        layoutConfig: {
                            widthSpec: LayoutSpec.WRAP_CONTENT,
                            heightSpec: LayoutSpec.EXACTLY,
                            alignment: gravity().center(),
                        },
                        text: `Cell At Line ${idx}`,
                        textAlignment: gravity().center(),
                        textColor: Color.parse("#ffffff"),
                        textSize: 20,
                        height: 50,
                        bgColor: Color.parse('#00ff00'),
                    }))
                },
                layoutConfig: {
                    widthSpec: LayoutSpec.AT_MOST,
                    heightSpec: LayoutSpec.AT_MOST,
                },
            }),
        ]).also(it => {
            it.layoutConfig = {
                widthSpec: LayoutSpec.AT_MOST,
                heightSpec: LayoutSpec.AT_MOST,
            }
        }))
    }
}