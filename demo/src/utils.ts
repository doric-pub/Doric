import { Color, text, Stack, Text, layoutConfig, LayoutSpec, gravity } from "doric";

export const colors = [
    "#70a1ff",
    "#7bed9f",
    "#ff6b81",
    "#a4b0be",
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
].map(e => Color.parse(e))

export function label(str: string) {
    return text({
        text: str,
        textSize: 16,
    })
}

export function box(idx = 0) {
    return (new Stack).also(it => {
        it.width = it.height = 20
        it.bgColor = colors[idx || 0]
    })
}
export function boxStr(str: string, idx = 0) {
    return (new Text).also(it => {
        it.width = it.height = 20
        it.text = str
        it.textColor = Color.WHITE
        it.bgColor = colors[idx || 0]
    })
}

export function title(str: string) {
    return text({
        text: "Network Demo",
        layoutConfig: layoutConfig().w(LayoutSpec.AT_MOST),
        textSize: 30,
        textColor: Color.WHITE,
        bgColor: colors[1],
        textAlignment: gravity().center(),
        height: 50,
    })
}