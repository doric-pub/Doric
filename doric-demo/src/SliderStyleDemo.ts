import { Group, Panel, gravity, LayoutSpec, vlayout, slider, slideItem, layoutConfig, modal, stack } from "doric";
import { colors } from "./utils";

@Entry
class SliderStyleDemo extends Panel {
    build(rootView: Group): void {
        let pager = slider({
            itemCount: 12,
            renderPage: (idx) => {
                return slideItem(stack([], {
                    width: Environment.screenWidth * 307 / 375,
                    height: Environment.screenWidth * 307 / 375 * 520 / 307,
                    layoutConfig: layoutConfig()
                        .configWidth(LayoutSpec.JUST)
                        .configHeight(LayoutSpec.JUST)
                        .configAlignment(gravity().center()),
                    backgroundColor: (colors[++idx % colors.length])
                }))
            },
            slideStyle: { type: "gallery", minScale: 480 / 520, minAlpha: 0.5, itemWidth: Environment.screenWidth * 307 / 375 },
            layoutConfig: {
                widthSpec: LayoutSpec.MOST,
                heightSpec: LayoutSpec.MOST,
                weight: 1,
            }
        })

        rootView.addChild(vlayout([
            pager,
        ]).also(it => {
            it.layoutConfig = {
                widthSpec: LayoutSpec.MOST,
                heightSpec: LayoutSpec.MOST,
            }
        }))

        setTimeout(() => {
            pager.slidePage(this.context, 2, false);
        }, 200)
    }
}