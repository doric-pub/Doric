import { layoutConfig, LayoutSpec, Panel, Root, scroller, vlayout } from "doric";
import { richTitleView, } from "./components/RichTitleView";
import logo from "./images/logo_w.png"

@Entry
class ComponentDemo extends Panel {
    build(root: Root) {
        scroller(
            vlayout(
                [
                    richTitleView().applyChild({
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