import { Group, Panel, navbar, text, gravity, Color, LayoutSpec, vlayout, Gravity, hlayout, scroller, layoutConfig, image, modal, navigator, ViewHolder, Text, ViewModel, VMPanel } from "doric";
import { title, label, colors } from "./utils";
import { ModalDemo } from "./ModalDemo";

interface CountModel {
    count: number
}
class CounterView extends ViewHolder {
    number!: Text
    counter!: Text
    build(root: Group) {
        vlayout(
            [
                text({
                    textSize: 40,
                    tag: "tvNumber"
                }),

                text({
                    text: "Click To Count 1",
                    textSize: 20,
                    tag: "tvCounter"
                }),
            ],
            {
                layoutConfig: layoutConfig().most(),
                gravity: Gravity.Center,
                space: 20,
            }
        ).in(root)
        this.number = root.findViewByTag("tvNumber")!
        this.counter = root.findViewByTag("tvCounter")!
    }
}

class CounterVM extends ViewModel<CountModel, CounterView> {
    onAttached(s: CountModel, vh: CounterView) {
        vh.counter.onClick = () => {
            this.updateState(state => {
                state.count++
            })
        }
    }
    onBind(s: CountModel, vh: CounterView) {
        vh.number.text = `${s.count}`
    }
}

class MyPage extends VMPanel<CountModel, CounterView>{


    getViewHolderClass() {
        return CounterView
    }

    getViewModelClass() {
        return CounterVM
    }

    getState(): CountModel {
        return {
            count: 0
        }
    }
}

@Entry(exports = [ModalDemo, MyPage])
class MultiPanelDemo extends Panel {
    build(rootView: Group): void {
        scroller(
            vlayout(
                [
                    title("Multi Panel"),
                    label('isHidden').apply({
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