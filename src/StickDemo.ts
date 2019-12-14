import { Panel, Group, scroller, vlayout, image, layoutConfig, LayoutSpec, Input, Gravity, log, stack, hlayout, text, IHLayout, CENTER, slider, slideItem, modal, Slider, Text, Color, View, Stack, animate, flowlayout, FlowLayoutItem, NestedSlider, ScaleType } from "doric";
import { title, colors } from "./utils";

function tab(idx: number, title: string, sliderView: Slider) {
    return text({
        text: title,
        layoutConfig: layoutConfig().exactly().wg(1),
        height: 41,
        onClick: () => {
            sliderView.slidePage(context, 0, true)
        },
    })
}

@Entry
class StickDemo extends Panel {
    private tabs!: Text[]
    private indicator!: View
    private sliderView!: NestedSlider
    build(root: Group) {
        this.indicator = new Stack
        this.indicator.backgroundColor = colors[0]
        this.indicator.width = 20
        this.indicator.height = 2

        scroller(
            vlayout([
                stack([
                    image({
                        layoutConfig: layoutConfig().atmost(),
                        imageUrl: "https://p.upyun.com/demo/webp/webp/jpg-0.webp",
                        scaleType: ScaleType.ScaleAspectFill,
                    }),

                ]).apply({
                    layoutConfig: layoutConfig().atmost().h(LayoutSpec.EXACTLY),
                    height: 200,
                    backgroundColor: colors[0],
                }),
                stack([
                    hlayout([
                        ...this.tabs = [0, 1, 2].map(idx => {
                            return text({
                                text: `Tab  ${idx}`,
                                layoutConfig: layoutConfig().exactly().wg(1),
                                height: 41,
                                onClick: () => {
                                    this.sliderView.slidePage(context, idx, true)
                                },
                            })
                        })
                    ]).apply({
                        layoutConfig: layoutConfig().atmost(),
                        gravity: Gravity.Center,
                    } as IHLayout),
                    this.indicator,
                ]).apply({
                    layoutConfig: layoutConfig().atmost().h(LayoutSpec.EXACTLY),
                    height: 57,
                }),

                (new NestedSlider).also(v => {
                    this.sliderView = v;
                    v.onPageSlided = (idx) => {
                        this.refreshTabs(idx)
                    }
                    [0, 1, 2].map(idx => {
                        return flowlayout({
                            layoutConfig: layoutConfig().exactly(),
                            width: root.width,
                            height: root.height - 57,
                            itemCount: 100,
                            columnCount: 2,
                            columnSpace: 10,
                            rowSpace: 10,
                            renderItem: (itemIdx) => {
                                return new FlowLayoutItem().apply({
                                    backgroundColor: colors[itemIdx % colors.length],
                                    height: 50,
                                    layoutConfig: layoutConfig().w(LayoutSpec.AT_MOST),
                                }).also(it => {
                                    it.addChild(text({
                                        text: `In Page ${idx},${itemIdx}`,
                                        textColor: Color.WHITE,
                                        textSize: 20,
                                        layoutConfig: layoutConfig().wrap().a(Gravity.Center)
                                    }).also(v => {
                                        v.onClick = () => {
                                            v.text = "Clicked"
                                        }
                                    }))
                                })
                            },
                        })
                    }).forEach(e => {
                        v.addSlideItem(e)
                    })
                }).apply({
                    layoutConfig: layoutConfig().exactly(),
                    width: root.width,
                    height: root.height - 57,
                }),
            ])
                .also(it => {
                    it.layoutConfig = layoutConfig().atmost().h(LayoutSpec.WRAP_CONTENT)
                }))
            .apply({
                layoutConfig: layoutConfig().atmost()
            })
            .in(root)
        this.indicator.centerX = this.getRootView().width / this.tabs.length / 2
        this.refreshTabs(0)
    }

    refreshTabs(page: number) {
        this.tabs.forEach((e, idx) => {
            if (idx == page) {
                e.textColor = colors[0]
            } else {
                e.textColor = Color.BLACK
            }
        })
        this.indicator.layoutConfig = layoutConfig().exactly().a(Gravity.Bottom).m({ bottom: 13 })
        animate(context)({
            animations: () => {
                this.indicator.centerX = this.getRootView().width / this.tabs.length * (page + 0.5)
            },
            duration: 300,
        })
    }
}