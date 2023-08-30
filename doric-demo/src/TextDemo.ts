import { Panel, Group, scroller, vlayout, layoutConfig, LayoutSpec, Input, Gravity, input, text, Color, Text, InputType, hlayout, GradientOrientation, AssetsResource } from "doric";
import { title } from "./utils";
@Entry
class TextDemo extends Panel {
    build(root: Group) {
        scroller(
            vlayout(
                [
                    title("Text Demo"),
                    text({
                        text: '十万钻石场',
                        textSize: 60,
                        font: 'PingFangSC-Medium',
                        textAlignment: Gravity.Center,
                        shadow: {
                            color: Color.parse('#640000'),
                            opacity: 0.49,
                            radius: 0.5,
                            offsetX: 0,
                            offsetY: 1,
                        },
                        textColor: {
                            colors: [Color.parse('#FFFFFF'), Color.parse('#FFE6A5'), Color.parse('#FFE39B'), Color.parse('#FFF0CE')],
                            locations: [0.0, 0.7, 0.9, 1.0],
                            orientation: GradientOrientation.TOP_BOTTOM,
                        }
                    }).apply({
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.FIT,
                            margin: { top: 131 },
                            alignment: Gravity.CenterX,
                        }
                    }),
                    input({
                        width: 100,
                        height: 100,
                        inputType: InputType.Number,
                        hintText: "number"
                    }),
                    hlayout([
                        text({
                            text: "size 10",
                            textSize: 10,
                            backgroundColor: Color.GREEN
                        }),
                        text({
                            text: "size 25",
                            textSize: 25,
                            backgroundColor: Color.BLUE
                        }),
                        text({
                            text: "size 18",
                            textSize: 18,
                            backgroundColor: Color.LTGRAY,
                        })
                    ], {
                        backgroundColor: Color.RED,
                        height: 50,
                        gravity: Gravity.CenterX,
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST).configHeight(LayoutSpec.JUST),
                    }),
                    text({
                        text: "This is normal text! This is normal text! This is normal text! This is normal text! This is normal text! This is normal text! ",
                        maxLines: 2,
                        backgroundColor: Color.LTGRAY,
                        layoutConfig:layoutConfig().configWidth(LayoutSpec.JUST).configHeight(LayoutSpec.FIT),
                        width:320,
                        border:{"width":1, "color":Color.RED},
                        margin:{left:15,right:17}
                    }),
                    hlayout([
                        text({
                            text: "T_B",
                            textSize: 60,
                            textColor: {
                                start: Color.RED,
                                end: Color.GREEN,
                                orientation: GradientOrientation.TOP_BOTTOM,
                            }
                        }),
                        text({
                            text: "B_T",
                            textSize: 60,
                            textColor: {
                                start: Color.RED,
                                end: Color.GREEN,
                                orientation: GradientOrientation.BOTTOM_TOP,
                            }
                        }),
                    ], {
                        space: 20
                    }),
                    hlayout([
                        text({
                            text: "TR_BL",
                            textSize: 60,
                            textColor: {
                                start: Color.RED,
                                end: Color.GREEN,
                                orientation: GradientOrientation.TR_BL,
                            }
                        }),
                        text({
                            text: "BL_TR",
                            textSize: 60,
                            textColor: {
                                start: Color.RED,
                                end: Color.GREEN,
                                orientation: GradientOrientation.BL_TR,
                            }
                        }),
                    ], {
                        space: 20
                    }),
                    hlayout([
                        text({
                            text: "R_L",
                            textSize: 60,
                            textColor: {
                                start: Color.RED,
                                end: Color.GREEN,
                                orientation: GradientOrientation.RIGHT_LEFT,
                            }
                        }),
                        text({
                            text: "L_R",
                            textSize: 60,
                            textColor: {
                                start: Color.RED,
                                end: Color.GREEN,
                                orientation: GradientOrientation.LEFT_RIGHT,
                            }
                        }),
                    ], {
                        space: 20
                    }),
                    hlayout([
                        text({
                            text: "BR_TL",
                            textSize: 60,
                            textColor: {
                                start: Color.RED,
                                end: Color.GREEN,
                                orientation: GradientOrientation.BR_TL,
                            }
                        }),
                        text({
                            text: "TL_BR",
                            textSize: 60,
                            textColor: {
                                start: Color.RED,
                                end: Color.GREEN,
                                orientation: GradientOrientation.TL_BR,
                            }
                        }),
                    ], {
                        space: 20
                    }),
                    text({
                        text: "grad",
                        textSize: 100,
                        textColor: {
                            colors: [Color.GREEN, Color.WHITE, Color.RED],
                            locations: [0, 0.5, 1],
                            orientation: GradientOrientation.TOP_BOTTOM
                        }
                    }),
                    text({
                        text: "This is normal text with shadow ",
                        textSize: 20,
                        shadow: {
                            color: Color.parse("#1DD6DE"),
                            offsetX: 0,
                            offsetY: 1,
                            opacity: 0.8,
                            radius: 3.0
                        }
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
                        text: "Icon Font text from   \ue631 ",
                        textSize: 10,
                        font: 'iconfont'
                    }),
                    text({
                        text: "Icon Font text from   \ue631 ",
                        textSize: 30,
                        font: 'iconfont'
                    }),
                    text({
                        text: "Icon Font text from res/font/  \ue631 ",
                        textSize: 10,
                        font: 'font_iconfont'
                    }),
                    text({
                        text: "Icon Font text from res/font/  \ue631 ",
                        textSize: 30,
                        font: 'font_iconfont.ttf'
                    }),
                    text({
                        text: "Icon Font text from assets/fonts/  \ue631 ",
                        textSize: 10,
                        font: 'assets/fonts/assets_iconfont'
                    }),
                    text({
                        text: "Icon Font text from assets/fonts/  \ue631 ",
                        textSize: 30,
                        font: 'assets/fonts/assets_iconfont.ttf'
                    }),
                    text({
                        text: "Font from custom loader.",
                        textSize: 10,
                    }),
                    text({
                        text: "Hanabi.ttf",
                        textSize: 30,
                        textColor: Color.BLUE,
                        font: new AssetsResource('Hanabi.ttf')
                    }),
                    text({
                        text: "Font from custom loader.",
                        textSize: 10,
                    }),
                    text({
                        text: "Alibaba-PuHuiTi-Bold.ttf",
                        textSize: 30,
                        textColor: Color.BLUE,
                        font: new AssetsResource('Alibaba-PuHuiTi-Bold.ttf')
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
                    text({
                        maxLines: 0,
                        maxWidth: root.width,
                        htmlText: `<div>
<h1>Supported tags by default</h1>
<ul>
<li>
<h2>br</h2>
<p>
To break<br/>lines<br/>in a<br/>paragraph,<br/>use the br tag.
</p>
</li>
<li>
<h2>p</h2>
<p>This is a paragraph.</p>
<p>This is a paragraph.</p>
<p>Paragraph elements are defined by p tags.</p>
<p style="color:#FF0000 text-decoration:line-through background:#eeeeee">
Support setting background color and foreground color and underline.</p>
</li>
<li>
<h2>ul</h2>
<p>An unordered list:</p>
<ul>
<li>coffee</li>
<li>tea</li>
<li>milk</li>
</ul>
</li>

<li>
<h2>div</h2>
<h3>This is a header</h3>
<p>This is a paragraph.</p>

<div style="color:#00FF00">
<h3>This is a header</h3>
<p>This is a paragraph.</p>
</div>
</li>
<li>
<h2>span</h2>
<p><span style="color:#FF0000">some text.</span>some other text.</p>
</li>
<li>
<h2>strong</h2>
<strong>This text is strong</strong>
</li>

<li>
<h2>b</h2>
<p>This is plain text <b>This is bold text</b>。</p>
</li>
<li>
<h2>em</h2>
<em>This text is emphasized</em>
</li>

<li>
<h2>cite</h2>
<cite>This text is cite</cite>
</li>
<li>
<h2>dfn</h2>
<dfn>This text is dfn</dfn>
</li>
<li>
<h2>i</h2>
<i>Italic</i>
</li>
<li>
<h2>big</h2>
<big>This text is big</big>
</li>
<li>
<h2>small</h2>
<small>This text is small</small>
</li>
<li>
<h2>font</h2>
<p><font  color="red" size=30>This is some text!</font></p>
<p><font  color="blue">This is some text!</font></p>
<p><font  color="green">This is some text!</font></p>
</li>
<li>
<h1>blockquote</h1>
Here comes a long quotation:
<blockquote>
This is a long quotation. This is a long quotation. This is a long quotation. This
is a long quotation. This is a long quotation.
</blockquote>
Please note that the browser adds line breaks before and after the blockquote element and increases the margins.
</li>
<li>
<h1>tt</h1>
</li>
<li>
<h1>a</h1>
<a href="https://m.baidu.com">Click anchor</a>
</li>
<li>
<h1>u</h1>
<u>Underline</u>
</li>
<li>
<h1>strike,s,del</h1>
<strike>This text is strike</strike>
<s>This text is s</s>
<del>This text is del</del>
</li>

<li>h1-h6</li>
<h1>h1</h1>
<h2>h2</h2>
<h3>h3</h3>
<h4>h4</h4>
<h5>h5</h5>
<h6>h6</h6>
<li>
<h1>img</h1>
</li>
</ul>
</div>
                    `
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
