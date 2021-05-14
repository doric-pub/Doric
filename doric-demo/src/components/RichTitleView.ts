import { Color, Gravity, HLayout, image, Image, layoutConfig, LayoutSpec, text, Text, ViewComponent, vlayout, } from "doric"
import { colors } from "../utils"

@ViewComponent
export class RichTitleView extends HLayout {
    title: Text
    subTitle: Text
    icon: Image
    constructor() {
        super()
        this.title = text({
            textSize: 30,
            textColor: Color.WHITE,
            textAlignment: Gravity.Center,
        })
        this.subTitle = text({
            textColor: Color.WHITE,
            textSize: 12,
        })
        this.icon = image({
            layoutConfig: layoutConfig().just(),
            width: 80,
            height: 80,
        })
        this.addChild(this.icon)
        this.addChild(
            vlayout(
                [
                    this.title,
                    this.subTitle,
                ],
                {
                    gravity: Gravity.Center,
                    space: 10,
                }))
        this.gravity = Gravity.Center
        this.space = 10
        this.layoutConfig = {
            widthSpec: LayoutSpec.MOST,
            heightSpec: LayoutSpec.FIT,
        }
        this.padding = {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
        }
        this.backgroundColor = colors[1]
    }

    applyChild(config: {
        title?: Partial<Text>,
        subTitle?: Partial<Text>,
        icon?: Partial<Image>,
    }) {
        this.title.hidden = !!!config.title?.text
        this.subTitle.hidden = !!!config.subTitle?.text
        this.icon.hidden = !!!config.icon
        if (config.title) {
            this.title.apply(config.title)
        }
        if (config.subTitle) {
            this.subTitle.apply(config.subTitle)
        }
        if (config.icon) {
            this.icon.apply(config.icon)
        }
        return this
    }
}

export function richTitleView(config?: Partial<RichTitleView>) {
    const ret = new RichTitleView
    if (config) {
        ret.apply(config)
    }
    return ret
}