import { Group, Panel, navbar, text, gravity, Color, LayoutSpec, vlayout, Gravity, hlayout, scroller, layoutConfig, image, modal, navigator, ViewHolder, Text, ViewModel, VMPanel } from "doric";
import { title, label, colors } from "./utils";
import { ModalDemo } from "./ModalDemo";
import { CounterPage } from './Counter'

@Entry(exports = [ModalDemo, CounterPage])
class MultiPanelDemo extends Panel {
    build(rootView: Group): void {
        scroller(
            vlayout(
                [
                    title("Multi Panel"),
                    label('ModalDemo').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            navigator(context).push(ModalDemo)
                        }
                    }),
                    label('Counter').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            navigator(context).push(CounterPage)
                        }
                    }),
                    label('Multi Panel').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            navigator(context).push(MultiPanelDemo)
                        }
                    }),
                ],
                {
                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                    gravity: gravity().center(),
                    space: 10,
                }),
            {
                layoutConfig: layoutConfig().most(),
                backgroundColor: Color.BLUE,
            }
        ).in(rootView)
    }
}