import { Panel, Group, scroller, vlayout, layoutConfig, LayoutSpec, Input, Gravity, log } from "doric";
import { title, colors } from "./utils";
@Entry
class InputDemo extends Panel {
    build(root: Group) {
        scroller(
            vlayout([
                title("Input Demo"),
                (new Input).also(it => {
                    it.layoutConfig = layoutConfig().just().configHeight(LayoutSpec.FIT)
                    it.width = 300
                    it.multiline = false
                    it.hintText = "HintText"
                    it.textAlignment = Gravity.Left
                    it.onTextChange = (s) => {
                        log(`onTextChange:${s}`)
                    }
                    it.onFocusChange = (f) => {
                        log(`onFocusChange:${f}`)
                    }
                }),
                (new Input).also(it => {
                    it.layoutConfig = layoutConfig().fit()
                    it.hintText = "HintText"
                    it.hintTextColor = colors[2]
                    it.textAlignment = Gravity.Left
                    it.textColor = colors[3]
                    it.onTextChange = (s) => {
                        log(`onTextChange:${s}`)
                    }
                    it.onFocusChange = (f) => {
                        log(`onFocusChange:${f}`)
                    }
                    it.backgroundColor = colors[1].alpha(0.3)
                }),
            ])
                .also(it => {
                    it.space = 10
                    it.layoutConfig = layoutConfig().most().configHeight(LayoutSpec.FIT)
                }))
            .apply({
                layoutConfig: layoutConfig().most()
            })
            .in(root)
    }

}