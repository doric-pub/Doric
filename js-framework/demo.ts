import { Gravity, Mutable, NativeCall, Text, Color, VLayout, Panel, log, logw, loge, Group, Stack, } from "./index"


@Entry
export class MyPage extends Panel {

    build(rootView: Group): void {
        const state = Mutable.of(1)
        const numberView = new Text
        numberView.width = 100
        numberView.height = 200
        numberView.top = 50
        state.bind((v) => {
            numberView.text = v.toString()
        })
        numberView.textSize = 40
        numberView.centerX = rootView.width / 2
        rootView.addChild(numberView)
        const click = new Text
        click.textSize = 20
        click.text = '点击计数'
        click.onClick = () => {
            state.set(state.get() + 1)
        }
        click.top = numberView.bottom + 20

        click.layoutConfig = {
            alignment: new Gravity().centerX()
        }

        rootView.addChild(click)

        const vlayout = new VLayout
        vlayout.width = this.getRootView().width
        vlayout.height = 500

        vlayout.top = 50
        vlayout.centerX = this.getRootView().width / 2
        vlayout.space = 0
        vlayout.gravity = (new Gravity()).bottom()
        const v = [1, 2, 3,].map(e => {
            const stack = new Stack
            stack.width = stack.height = 50
            stack.bgColor = Color.safeParse('#00ff00')
            vlayout.addChild(stack)
            stack.onClick = () => {
                loge('stack:onClick')
                if (vlayout.space !== undefined) {
                    loge('change space')
                    vlayout.space += 10
                }
            }
        })
        rootView.addChild(vlayout)
    }

    @NativeCall
    log() {
        log("Hello.HEGO")
        logw("Hello.HEGO")
        loge("Hello.HEGO")
    }
}