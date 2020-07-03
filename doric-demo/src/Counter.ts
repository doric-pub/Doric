import { text, vlayout, ViewHolder, VMPanel, ViewModel, Gravity, NativeCall, Text, Color, log, logw, loge, Group, LayoutSpec, layoutConfig, } from "doric"

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
                     tag:"tvNumber"
                }),

                text({
                    text: "Click To Count 1",
                    textSize: 20,
                    tag:"tvCounter"
                }),
            ],
            {
                layoutConfig: layoutConfig().most(),
                gravity: Gravity.Center,
                space: 20,
            }
        ).in(root)
       this.number= root.findViewByTag("tvNumber")!
       this.counter= root.findViewByTag("tvCounter")!
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

@Entry
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