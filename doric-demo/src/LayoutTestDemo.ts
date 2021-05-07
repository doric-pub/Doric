import { Panel, Group, vlayout, LayoutSpec, text, Color, gravity, stack, layoutConfig } from "doric";

@Entry
class LayoutTest extends Panel {
    build(root: Group) {
        vlayout(
            [
                text({
                    text: "Fit -> Most",
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.JUST,
                    },
                    textSize: 30,
                    textColor: Color.parse("#535c68"),
                    backgroundColor: Color.parse("#dff9fb"),
                    textAlignment: gravity().center(),
                    height: 50,
                }),
                stack(
                    [
                        stack(
                            [

                                text({
                                    text: "This is a stack content xxxxx",
                                    textSize: 20,
                                    textColor: Color.WHITE,
                                }),
                            ],
                            {
                                layoutConfig: layoutConfig().most(),
                                backgroundColor: Color.BLUE
                            }
                        ),
                        stack(
                            [

                                text({
                                    text: "This is a stack content 000000000",
                                    textSize: 20,
                                    textColor: Color.WHITE,
                                }),
                            ],
                            {
                                layoutConfig: layoutConfig().most(),
                                backgroundColor: Color.YELLOW,
                                alpha: 0.1
                            }
                        ),
                        text({
                            text: "This is a stack content",
                            textSize: 20,
                            textColor: Color.WHITE,
                        }),
                    ],
                    {
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.FIT,
                        },
                        backgroundColor: Color.RED
                    }),
                stack(
                    [
                        stack(
                            [],
                            {
                                layoutConfig: layoutConfig().most(),
                                backgroundColor: Color.BLUE
                            }
                        ),
                        text({
                            text: "This is a stack content",
                            textSize: 20,
                            textColor: Color.WHITE,
                        }),
                    ],
                    {
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.FIT,
                        },
                        backgroundColor: Color.RED
                    }),
                vlayout(
                    [
                        stack(
                            [],
                            {
                                layoutConfig: layoutConfig().most(),
                                backgroundColor: Color.BLUE
                            }
                        ),
                        text({
                            text: "This is a vlayout content",
                            textSize: 20,
                            textColor: Color.WHITE,
                        }),
                    ],
                    {
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.FIT,
                        },
                        backgroundColor: Color.RED
                    })
            ],
            {
                layoutConfig: {
                    widthSpec: LayoutSpec.MOST,
                    heightSpec: LayoutSpec.FIT,
                },
                space: 20,
            }).in(root)
    }
}