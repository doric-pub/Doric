'use strict';

var doric = require('doric');

const colors = [
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
].map(e => doric.Color.parse(e));
function title(str) {
    return doric.text({
        text: str,
        layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
        textSize: 30,
        textColor: doric.Color.WHITE,
        backgroundColor: colors[1],
        textAlignment: doric.gravity().center(),
        height: 50,
    });
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let TextDemo = class TextDemo extends doric.Panel {
    build(root) {
        doric.scroller(doric.vlayout([
            title("Text Demo"),
            doric.input({
                width: 100,
                height: 100,
                inputType: doric.InputType.Number,
                hintText: "number"
            }),
            doric.hlayout([
                doric.text({
                    text: "size 10",
                    textSize: 10,
                    backgroundColor: doric.Color.GREEN
                }),
                doric.text({
                    text: "size 25",
                    textSize: 25,
                    backgroundColor: doric.Color.BLUE
                }),
                doric.text({
                    text: "size 18",
                    textSize: 18,
                    backgroundColor: doric.Color.LTGRAY,
                })
            ], {
                backgroundColor: doric.Color.RED,
                height: 50,
                gravity: doric.Gravity.CenterX,
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST).configHeight(doric.LayoutSpec.JUST),
            }),
            doric.text({
                text: "This is normal text",
            }),
            doric.text({
                text: "This is normal text with shadow ",
                textSize: 20,
                shadow: {
                    color: doric.Color.parse("#1DD6DE"),
                    offsetX: 0,
                    offsetY: 1,
                    opacity: 0.8,
                    radius: 3.0
                }
            }),
            doric.text({
                text: "This is normal text",
                textSize: 30,
            }),
            doric.text({
                text: "This is bold text",
                fontStyle: "bold",
            }),
            doric.text({
                text: "This is bold text",
                textSize: 30,
                fontStyle: "bold"
            }),
            doric.text({
                text: "This is italic text",
                fontStyle: "italic"
            }),
            doric.text({
                text: "This is italic text",
                textSize: 30,
                fontStyle: "italic"
            }),
            doric.text({
                text: "This is bold_italic text",
                fontStyle: "bold_italic"
            }),
            doric.text({
                text: "This is bold_italic text",
                textSize: 30,
                fontStyle: "bold_italic"
            }),
            doric.text({
                text: "Icon Font text from   \ue631 ",
                textSize: 10,
                font: 'iconfont'
            }),
            doric.text({
                text: "Icon Font text from   \ue631 ",
                textSize: 30,
                font: 'iconfont'
            }),
            doric.text({
                text: "Icon Font text from res/font/  \ue631 ",
                textSize: 10,
                font: 'font_iconfont'
            }),
            doric.text({
                text: "Icon Font text from res/font/  \ue631 ",
                textSize: 30,
                font: 'font_iconfont.ttf'
            }),
            doric.text({
                text: "Icon Font text from assets/fonts/  \ue631 ",
                textSize: 10,
                font: 'fonts/assets_iconfont'
            }),
            doric.text({
                text: "Icon Font text from assets/fonts/  \ue631 ",
                textSize: 30,
                font: 'fonts/assets_iconfont.ttf'
            }),
            doric.text({
                text: "This is line Spaceing 0,\nSecond line",
                maxLines: 0,
            }),
            doric.text({
                text: "This is line Spaceing 40,\nSecond line",
                maxLines: 0,
                lineSpacing: 40,
                textColor: doric.Color.RED,
                textAlignment: doric.Gravity.Right,
                onClick: function () {
                    this.textAlignment = doric.Gravity.Left;
                    this.textColor = doric.Color.BLACK;
                }
            }),
            doric.text({
                text: "This is strikethrough text.",
                textSize: 20,
                textColor: doric.Color.RED,
                strikethrough: true,
            }),
            doric.text({
                text: "This is underline text.",
                textSize: 20,
                textColor: doric.Color.BLUE,
                underline: true,
            }),
            doric.text({
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
        ], {
            space: 10,
            layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT)
        }), {
            layoutConfig: doric.layoutConfig().most()
        }).in(root);
    }
};
TextDemo = __decorate([
    Entry
], TextDemo);
//# sourceMappingURL=TextDemo.js.map
