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

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
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
    let tv1;
    let sTv1;
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
        () => __awaiter(this, void 0, void 0, function* () {
            const width = yield sTv1.getWidth(context);
             doric.loge("get width"+width)
            return doric.animate(context)({
                animations: () => {
                console.log(width)
                    if(width){
                     tv1.width = width;
                    }

                },
                duration: 5000
            });
        }),
    ];
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
That she that makes me sin awards me pain.`;
let TextAnimationDemo = class TextAnimationDemo extends doric.Panel {
    onCreate() {
//        doric.navbar(context).setHidden(true);
    }
    build(root) {
        doric.loge("build");
        const poemLines = poem.split('\n').map(e => {
            return lineText({
                text: e.trim()
            });
        });
        doric.vlayout([
            ...poemLines.map(e => e[0])
        ], {
            layoutConfig: {
                widthSpec: doric.LayoutSpec.MOST,
                heightSpec: doric.LayoutSpec.MOST,
            },
            backgroundColor: colors[0],
            space: 10,
            gravity: doric.Gravity.Center
        }).in(root);
        this.addOnRenderFinishedCallback(() => __awaiter(this, void 0, void 0, function* () {
            const animates = poemLines.map(e => e[1]);
            for (let i = 0; i < animates.length; i++) {
                doric.loge("beigin animation");
                yield animates[i]();
            }
        }));
    }
};
TextAnimationDemo = __decorate([
    Entry
], TextAnimationDemo);
//# sourceMappingURL=TextAnimationDemo.js.map
