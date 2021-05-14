import { Switch, Gravity, hlayout, HLayout, layoutConfig, switchView, Text, text, ViewComponent, vlayout } from "doric";

@ViewComponent
export class PreferenceView extends HLayout {
    title: Text
    subTitle: Text
    switch: Switch
    constructor() {
        super()
        hlayout(
            [
                vlayout(
                    [
                        this.title = text({
                            textSize: 20,
                        }),
                        this.subTitle = text({
                            textSize: 12,
                        }),
                    ],
                    {
                        layoutConfig: layoutConfig().fit().configWeight(1),
                        space: 2,
                    }),
                this.switch = switchView({
                    state: true,
                }),
            ],
            {
                layoutConfig: layoutConfig().mostWidth().fitHeight(),
                gravity: Gravity.Center,
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                }
            }).in(this)
        this.layoutConfig = layoutConfig().mostWidth().fitHeight()
    }

    applyChild(config: {
        title?: Partial<Text>,
        subTitle?: Partial<Text>,
        switch?: Partial<Switch>,
    }) {
        this.title.hidden = !!!config.title?.text
        this.subTitle.hidden = !!!config.subTitle?.text
        if (config.title) {
            this.title.apply(config.title)
        }
        if (config.subTitle) {
            this.subTitle.apply(config.subTitle)
        }
        if (config.switch) {
            this.switch.apply(config.switch)
        }
        return this
    }
}

export function preferenceView(config?: Partial<PreferenceView>) {
    const ret = new PreferenceView
    if (config) {
        ret.apply(config)
    }
    return ret
}