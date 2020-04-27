import { Panel, Group, vlayout, stack, LayoutSpec, Gravity, Text, text, Color, animate, TruncateAt, Stack, navbar } from "doric";
import { colors } from "./utils";


function lineText(config: Partial<Text>): [Stack, () => Promise<unknown>] {
    let tv1: Text
    let sTv1: Text
    return [
        stack(
            [
                sTv1 = text(config).apply({
                    alpha: 0,
                    textSize: 16,
                    fontStyle: "italic",
                }),
                tv1 = text({
                    text: sTv1.text,
                    textColor: Color.WHITE,
                    textSize: sTv1.textSize,
                    fontStyle: sTv1.fontStyle,
                    layoutConfig: {
                        widthSpec: LayoutSpec.JUST,
                        heightSpec: LayoutSpec.FIT,
                    },
                    truncateAt: TruncateAt.Clip,
                })
            ],
        ),
        async () => {
            const width = await sTv1.getWidth(context)
            return animate(context)({
                animations: () => {
                    tv1.width = width
                },
                duration: 5000
            })
        },
    ]
}

const poem = `In faith I do not love thee with mine eyes,
For they in thee a thousand errors note;
But \`tis my heart that loves what they despise,
Who in despite of view is pleased to dote.
Nor are mine ears with thy tongue\`s tune delighted;
Nor tender feeling to base touches prone,
Nor taste, nor smell, desire to be invited
To any sensual feast with thee alone.
But my five wits, nor my five senses can
Dissuade one foolish heart from serving thee,
Who leaves unswayed the likeness of a man,
Thy proud heart\`s slave and vassal wretch to be.
Only my plague thus far I count my gain,
That she that makes me sin awards me pain.`


@Entry
class TextAnimationDemo extends Panel {
    onCreate() {
        navbar(context).setHidden(true)
    }
    build(root: Group) {
        const poemLines = poem.split('\n').map(e => {
            return lineText({
                text: e.trim()
            })
        })
        vlayout(
            [
                ...poemLines.map(e => e[0])
            ],
            {
                layoutConfig: {
                    widthSpec: LayoutSpec.MOST,
                    heightSpec: LayoutSpec.MOST,
                },
                backgroundColor: colors[0],
                space: 10,
                gravity: Gravity.Center
            }
        ).in(root)
        this.addOnRenderFinishedCallback(async () => {
            const animates = poemLines.map(e => e[1])
            for (let i = 0; i < animates.length; i++) {
                await animates[i]()
            }
        })
    }
}