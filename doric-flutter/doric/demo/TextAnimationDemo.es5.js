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

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function lineText(config) {
    var this$1 = this;

    var tv1;
    var sTv1;
    return [
        doric.stack([
            sTv1 = doric.text(config).apply({
                alpha: 0,
                textSize: 16,
                fontStyle: "italic",
            }),
            tv1 = doric.text({
                text: sTv1.text,
                textColor: doric.Color.WHITE,
                textSize: sTv1.textSize,
                fontStyle: sTv1.fontStyle,
                layoutConfig: {
                    widthSpec: doric.LayoutSpec.JUST,
                    heightSpec: doric.LayoutSpec.FIT,
                },
                truncateAt: doric.TruncateAt.Clip,
            })
        ]),
        function () { return __awaiter(this$1, void 0, void 0, function* () {
            var width = yield sTv1.getWidth(context);
            return doric.animate(context)({
                animations: function () {
                    tv1.width = width;
                },
                duration: 5000
            });
        }); } ];
}
var poem = "In faith I do not love thee with mine eyes,\nFor they in thee a thousand errors note;\nBut `tis my heart that loves what they despise,\nWho in despite of view is pleased to dote.\nNor are mine ears with thy tongue`s tune delighted;\nNor tender feeling to base touches prone,\nNor taste, nor smell, desire to be invited\nTo any sensual feast with thee alone.\nBut my five wits, nor my five senses can\nDissuade one foolish heart from serving thee,\nWho leaves unswayed the likeness of a man,\nThy proud heart`s slave and vassal wretch to be.\nOnly my plague thus far I count my gain,\nThat she that makes me sin awards me pain.";
var TextAnimationDemo = /*@__PURE__*/(function (Panel) {
    function TextAnimationDemo () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) TextAnimationDemo.__proto__ = Panel;
    TextAnimationDemo.prototype = Object.create( Panel && Panel.prototype );
    TextAnimationDemo.prototype.constructor = TextAnimationDemo;

    TextAnimationDemo.prototype.onCreate = function onCreate () {
        doric.navbar(context).setHidden(true);
    };
    TextAnimationDemo.prototype.build = function build (root) {
        var this$1 = this;

        var poemLines = poem.split('\n').map(function (e) {
            return lineText({
                text: e.trim()
            });
        });
        doric.vlayout([].concat( poemLines.map(function (e) { return e[0]; }) ), {
            layoutConfig: {
                widthSpec: doric.LayoutSpec.MOST,
                heightSpec: doric.LayoutSpec.MOST,
            },
            backgroundColor: colors[0],
            space: 10,
            gravity: doric.Gravity.Center
        }).in(root);
        this.addOnRenderFinishedCallback(function () { return __awaiter(this$1, void 0, void 0, function* () {
            var animates = poemLines.map(function (e) { return e[1]; });
            for (var i = 0; i < animates.length; i++) {
                yield animates[i]();
            }
        }); });
    };

    return TextAnimationDemo;
}(doric.Panel));
TextAnimationDemo = __decorate([
    Entry
], TextAnimationDemo);
//# sourceMappingURL=TextAnimationDemo.es5.js.map
