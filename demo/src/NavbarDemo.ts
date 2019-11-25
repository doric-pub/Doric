import { Group, Panel, navbar, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text, scroller, layoutConfig, image, IView, IVLayout, ScaleType, modal, IText, network } from "doric";
import { title, label, colors } from "./utils";

@Entry
class NavbarDemo extends Panel {
    build(rootView: Group): void {
        scroller(vlayout([
            title("Navbar Demo"),
            label('isHidden').apply({
                width: 200,
                height: 50,
                bgColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
                onClick: () => {
                    navbar(context).isHidden().then(e => modal(context).alert(`Navbar isHidden:${e}`)).catch(e => {
                        modal(context).alert(e)
                    })
                }
            } as IText),
            label('setHidden').apply({
                width: 200,
                height: 50,
                bgColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
                onClick: () => {
                    navbar(context).isHidden()
                        .then(e => navbar(context).setHidden(!e))
                        .catch(e => {
                            modal(context).alert(e)
                        })
                }
            } as IText),
            label('setTitle').apply({
                width: 200,
                height: 50,
                bgColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
                onClick: () => {
                    navbar(context).setTitle('Setted Title')
                        .catch(e => {
                            modal(context).alert(e)
                        })
                }
            } as IText),
            label('setBgColor').apply({
                width: 200,
                height: 50,
                bgColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().exactly(),
                onClick: () => {
                    navbar(context).setBgColor(Color.YELLOW)
                        .catch(e => {
                            modal(context).alert(e)
                        })
                }
            } as IText),
        ]).apply({
            layoutConfig: layoutConfig().atmost().h(LayoutSpec.WRAP_CONTENT),
            gravity: gravity().center(),
            space: 10,
        } as IVLayout)).apply({
            layoutConfig: layoutConfig().atmost(),
        }).in(rootView)
    }
}