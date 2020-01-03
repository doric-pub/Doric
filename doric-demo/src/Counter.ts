import { text, vlayout, ViewHolder, VMPanel, ViewModel, Gravity, NativeCall, Text, Color, log, logw, loge, Group, LayoutSpec, layoutConfig, IVLayout, } from "doric"

interface CountModel {
    count: number
}
class CounterView extends ViewHolder {
    number!: Text
    counter!: Text
    build(root: Group) {
        vlayout([
            this.number = text({
                textSize: 40,
            }),

            this.counter = text({
                text: "Click To Count",
                textSize: 20,
            }),
        ]).apply({
            layoutConfig: layoutConfig().most(),
            gravity: Gravity.Center,
            space: 20,
        } as IVLayout).in(root)
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