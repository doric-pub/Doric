import { Panel, Group, scroller, vlayout, layoutConfig, LayoutSpec, Input, Gravity, log, input, text } from "doric";
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