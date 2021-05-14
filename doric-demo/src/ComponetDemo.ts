import { layoutConfig, LayoutSpec, Panel, Root, scroller, vlayout } from "doric";
import { preferenceView } from "./components/PreferenceView";
import { RichTitleView, richTitleView } from "./components/RichTitleView";
import logo from "./images/logo_w.png"

@Entry
class ComponentDemo extends Panel {
    build(root: Root) {
        let richTitle: RichTitleView
        scroller(
            vlayout(
                [
                    richTitle = richTitleView().applyChild({
                        title: {
                            text: "This is title"
                        },
                        subTitle: {
                            text: "This is subtitle",
                        },
                        icon: {
                            imageBase64: logo,
                        }
                    }),
                    preferenceView().applyChild({
                        title: {
                            text: "Show Icon"
                        },
                        switch: {
                            state: true,
                            onSwitch: (ret) => {
                                richTitle.icon.hidden = !ret
                            }
                        }
                    }),
                    preferenceView().applyChild({
                        title: {
                            text: "Show Title"
                        },
                        switch: {
                            state: true,
                            onSwitch: (ret) => {
                                richTitle.title.hidden = !ret
                            }
                        }
                    }),
                    preferenceView().applyChild({
                        title: {
                            text: "Show Subtitle"
                        },
                        switch: {
                            state: true,
                            onSwitch: (ret) => {
                                richTitle.subTitle.hidden = !ret
                            }
                        }
                    }),
                ],
                {
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.FIT,
                    },
                    space: 10,
                }),
            {
                layoutConfig: layoutConfig().most(),
            }
        ).in(root)
    }
}