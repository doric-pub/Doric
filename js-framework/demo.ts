import { Gravity, Mutable, NativeCall, Text, Color, VLayout, Panel, log, logw, loge, Group, Stack, } from "./index"
import { WRAP_CONTENT } from "./src/ui/view";


@Entry
export class MyPage extends Panel {

    build(rootView: Group): void {
        const state = Mutable.of(1)
        const numberView = new Text
        numberView.width = WRAP_CONTENT
        numberView.height = WRAP_CONTENT
        numberView.top = 50
        state.bind((v) => {
            numberView.text = v.toString()
        })
        numberView.textSize = 40
        numberView.layoutConfig = {
            alignment: new Gravity().centerX()
        }
        rootView.addChild(numberView)
        const click = new Text
        click.textSize = 20
        click.text = '点击计数'
        click.onClick = () => {
            state.set(state.get() + 1)
        }
        click.top = 200

        click.layoutConfig = {
            alignment: new Gravity().centerX()
        }

        rootView.addChild(click)

        const vlayout = new VLayout
        vlayout.width = this.getRootView().width
        vlayout.height = 500
        vlayout.bgColor = Color.parse('#ff00ff')
        vlayout.top = 50
        vlayout.centerX = this.getRootView().width / 2
        vlayout.space = 0
        vlayout.gravity = (new Gravity()).bottom()
        vlayout.onClick = () => {
            const stack = new Stack
            stack.width = stack.height = 50
            stack.bgColor = Color.safeParse('#00ff00')
            vlayout.addChild(stack)
        }
        rootView.addChild(vlayout)
    }

    @NativeCall
    log() {
        log("Hello.HEGO")
        logw("Hello.HEGO")
        loge("Hello.HEGO")
    }
}