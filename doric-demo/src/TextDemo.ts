import { Panel, Group, scroller, vlayout, layoutConfig, LayoutSpec, Input, Gravity, log, input, text, Color, Text } from "doric";
import { title } from "./utils";
@Entry
class TextDemo extends Panel {
    build(root: Group) {
        scroller(
            vlayout(
                [
                    title("Text Demo"),
                    text({
                        text: "This is normal text",
                    }),
                    text({
                        text: "This is normal text",
                        textSize: 20,
                    }),
                    text({
                        text: "This is normal text",
                        textSize: 30,
                    }),
                    text({
                        text: "This is bold text",
                        fontStyle: "bold",
                    }),
                    text({
                        text: "This is bold text",
                        textSize: 30,
                        fontStyle: "bold"
                    }),
                    text({
                        text: "This is italic text",
                        fontStyle: "italic"
                    }),
                    text({
                        text: "This is italic text",
                        textSize: 30,
                        fontStyle: "italic"
                    }),
                    text({
                        text: "This is bold_italic text",
                        fontStyle: "bold_italic"
                    }),
                    text({
                        text: "This is bold_italic text",
                        textSize: 30,
                        fontStyle: "bold_italic"
                    }),
                    text({
                        text: "This is Icon Font text \ue631",
                        font: 'iconfont'
                    }),
                    text({
                        text: "This is Icon Font text \ue631",
                        textSize: 30,
                        font: 'iconfont'
                    }),
                    text({
                        text: "This is line Spaceing 0,\nSecond line",
                        maxLines: 0,
                    }),
                    text({
                        text: "This is line Spaceing 40,\nSecond line",
                        maxLines: 0,
                        lineSpacing: 40,
                        textColor: Color.RED,
                        textAlignment: Gravity.Right,
                        onClick: function () {
                            (this as Text).textAlignment = Gravity.Left;
                            (this as Text).textColor = Color.BLACK;
                        }
                    }),
                    text({
                        text: "This is strikethrough text.",
                        textSize: 20,
                        textColor: Color.RED,
                        strikethrough: true,
                    }),
                    text({
                        text: "This is underline text.",
                        textSize: 20,
                        textColor: Color.BLUE,
                        underline: true,
                    }),
                ],
                {
                    space: 10,
                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT)
                }
            ),
            {
                layoutConfig: layoutConfig().most()
            }
        ).in(root)
    }

}