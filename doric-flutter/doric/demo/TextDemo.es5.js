'use strict';

var doric = require('doric');

var colors = [
    "#70a1ff",
    "#7bed9f",
    "#ff6b81",
    "#a4b0be",
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b" ].map(function (e) { return doric.Color.parse(e); });
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
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TextDemo = /*@__PURE__*/(function (Panel) {
    function TextDemo () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) TextDemo.__proto__ = Panel;
    TextDemo.prototype = Object.create( Panel && Panel.prototype );
    TextDemo.prototype.constructor = TextDemo;

    TextDemo.prototype.build = function build (root) {
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
                htmlText: "<div>\n<h1>Supported tags by default</h1>\n<ul>\n<li>\n<h2>br</h2>\n<p>\nTo break<br/>lines<br/>in a<br/>paragraph,<br/>use the br tag.\n</p>\n</li>\n<li>\n<h2>p</h2>\n<p>This is a paragraph.</p>\n<p>This is a paragraph.</p>\n<p>Paragraph elements are defined by p tags.</p>\n<p style=\"color:#FF0000 text-decoration:line-through background:#eeeeee\">\nSupport setting background color and foreground color and underline.</p>\n</li>\n<li>\n<h2>ul</h2>\n<p>An unordered list:</p>\n<ul>\n<li>coffee</li>\n<li>tea</li>\n<li>milk</li>\n</ul>\n</li>\n\n<li>\n<h2>div</h2>\n<h3>This is a header</h3>\n<p>This is a paragraph.</p>\n\n<div style=\"color:#00FF00\">\n<h3>This is a header</h3>\n<p>This is a paragraph.</p>\n</div>\n</li>\n<li>\n<h2>span</h2>\n<p><span style=\"color:#FF0000\">some text.</span>some other text.</p>\n</li>\n<li>\n<h2>strong</h2>\n<strong>This text is strong</strong>\n</li>\n\n<li>\n<h2>b</h2>\n<p>This is plain text <b>This is bold text</b>。</p>\n</li>\n<li>\n<h2>em</h2>\n<em>This text is emphasized</em>\n</li>\n\n<li>\n<h2>cite</h2>\n<cite>This text is cite</cite>\n</li>\n<li>\n<h2>dfn</h2>\n<dfn>This text is dfn</dfn>\n</li>\n<li>\n<h2>i</h2>\n<i>Italic</i>\n</li>\n<li>\n<h2>big</h2>\n<big>This text is big</big>\n</li>\n<li>\n<h2>small</h2>\n<small>This text is small</small>\n</li>\n<li>\n<h2>font</h2>\n<p><font  color=\"red\" size=30>This is some text!</font></p>\n<p><font  color=\"blue\">This is some text!</font></p>\n<p><font  color=\"green\">This is some text!</font></p>\n</li>\n<li>\n<h1>blockquote</h1>\nHere comes a long quotation:\n<blockquote>\nThis is a long quotation. This is a long quotation. This is a long quotation. This\nis a long quotation. This is a long quotation.\n</blockquote>\nPlease note that the browser adds line breaks before and after the blockquote element and increases the margins.\n</li>\n<li>\n<h1>tt</h1>\n</li>\n<li>\n<h1>a</h1>\n<a href=\"https://m.baidu.com\">Click anchor</a>\n</li>\n<li>\n<h1>u</h1>\n<u>Underline</u>\n</li>\n<li>\n<h1>strike,s,del</h1>\n<strike>This text is strike</strike>\n<s>This text is s</s>\n<del>This text is del</del>\n</li>\n\n<li>h1-h6</li>\n<h1>h1</h1>\n<h2>h2</h2>\n<h3>h3</h3>\n<h4>h4</h4>\n<h5>h5</h5>\n<h6>h6</h6>\n<li>\n<h1>img</h1>\n</li>\n</ul>\n</div>\n                    "
            }) ], {
            space: 10,
            layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT)
        }), {
            layoutConfig: doric.layoutConfig().most()
        }).in(root);
    };

    return TextDemo;
}(doric.Panel));
TextDemo = __decorate([
    Entry
], TextDemo);
//# sourceMappingURL=TextDemo.es5.js.map
