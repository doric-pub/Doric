import { NativeCall, Text, Alignment, Color, VLayout, Panel, log, logw, loge } from "./index"
import { Group } from "./src/ui/view";



@Entry
export class MyPage extends Panel {
    state = {
        count: 0
    }

    build(rootView: Group): void {
        const numberView = new Text
        numberView.width = 100
        numberView.height = 200
        numberView.top = 50
        numberView.text = this.state.count.toString()
        numberView.textSize = 40
        numberView.centerX = rootView.width / 2
        rootView.addChild(numberView)
        const click = new Text
        click.width = click.height = 100
        click.textSize = 20
        click.text = '点击计数'
        click.onClick = () => {
            this.state.count++
            numberView.text = this.state.count.toString()
        }
        click.centerX = rootView.width / 2
        click.top = numberView.bottom + 20
        rootView.addChild(click)
        rootView.bgColor = Color.safeParse('#00ff00')
    }

    @NativeCall
    log() {
        log("Hello.HEGO")
        logw("Hello.HEGO")
        loge("Hello.HEGO")
    }
}