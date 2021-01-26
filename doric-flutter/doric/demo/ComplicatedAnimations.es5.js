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
function box(idx) {
    if ( idx === void 0 ) idx = 0;

    return (new doric.Stack).also(function (it) {
        it.width = it.height = 20;
        it.backgroundColor = colors[idx || 0];
    });
}
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
function thisLabel(str) {
    return doric.text({
        text: str,
        width: 80,
        height: 30,
        backgroundColor: colors[0],
        textSize: 10,
        textColor: doric.Color.WHITE,
        layoutConfig: doric.layoutConfig().just(),
    });
}
var AnimationDemo = /*@__PURE__*/(function (Panel) {
    function AnimationDemo () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) AnimationDemo.__proto__ = Panel;
    AnimationDemo.prototype = Object.create( Panel && Panel.prototype );
    AnimationDemo.prototype.constructor = AnimationDemo;

    AnimationDemo.prototype.build = function build (rootView) {
        var view = box(2);
        var view2 = doric.image({
            imageUrl: "https://pic3.zhimg.com/v2-5847d0813bd0deba333fcbe52435e83e_b.jpg"
        });
        view.onClick = function () {
            doric.modal(context).toast('Clicked');
        };
        doric.vlayout([
            title("Complicated  Animation"),
            doric.vlayout([
                doric.hlayout([
                    thisLabel('reset').apply({
                        onClick: function () {
                            var rotation = new doric.RotationAnimation;
                            rotation.duration = 1000;
                            rotation.fromRotation = view.rotation || 0;
                            rotation.toRotation = 0;
                            var translation = new doric.TranslationAnimation;
                            translation.duration = 1000;
                            translation.fromTranslationX = view.translationX || 0;
                            translation.toTranslationX = 0;
                            translation.fromTranslationY = view.translationY || 0;
                            translation.toTranslationY = 0;
                            var scale = new doric.ScaleAnimation;
                            scale.duration = 1000;
                            scale.fromScaleX = view.scaleX || 1;
                            scale.toScaleX = 1;
                            scale.fromScaleY = view.scaleY || 1;
                            scale.toScaleY = 1;
                            var animationSet = new doric.AnimationSet;
                            animationSet.addAnimation(rotation);
                            animationSet.addAnimation(translation);
                            animationSet.addAnimation(scale);
                            view.doAnimation(context, animationSet).then(function () {
                                doric.modal(context).toast('Resetd');
                            });
                        }
                    }) ], { space: 10 }),
                doric.hlayout([
                    thisLabel('TranslationX').apply({
                        onClick: function () {
                            var animation = new doric.TranslationAnimation;
                            animation.duration = 1000;
                            animation.fromTranslationX = view.translationX || 0;
                            animation.toTranslationX = animation.fromTranslationX + 100;
                            animation.fromTranslationY = view.translationY || 0;
                            animation.toTranslationY = view.translationY || 0;
                            view.doAnimation(context, animation);
                        }
                    }),
                    thisLabel('TranslationY').apply({
                        onClick: function () {
                            var animation = new doric.TranslationAnimation;
                            animation.duration = 1000;
                            animation.fromTranslationX = view.translationX || 0;
                            animation.toTranslationX = view.translationX || 0;
                            animation.fromTranslationY = view.translationY || 0;
                            animation.toTranslationY = animation.fromTranslationY + 100;
                            view.doAnimation(context, animation);
                        }
                    }),
                    thisLabel('ScaleX').apply({
                        onClick: function () {
                            var animation = new doric.ScaleAnimation;
                            animation.duration = 1000;
                            animation.fromScaleX = view.scaleX || 1;
                            animation.toScaleX = animation.fromScaleX + 1;
                            view.doAnimation(context, animation);
                        }
                    }),
                    thisLabel('ScaleY').apply({
                        onClick: function () {
                            var animation = new doric.ScaleAnimation;
                            animation.duration = 1000;
                            animation.fromScaleY = view.scaleY || 1;
                            animation.toScaleY = animation.fromScaleY + 1;
                            view.doAnimation(context, animation);
                        }
                    }),
                    thisLabel('rotation').apply({
                        onClick: function () {
                            var animation = new doric.RotationAnimation;
                            animation.duration = 1000;
                            animation.fromRotation = view.rotation || 0;
                            animation.toRotation = animation.fromRotation + 0.25;
                            view.doAnimation(context, animation);
                        }
                    }) ], { space: 10 }),
                doric.hlayout([
                    thisLabel('group').apply({
                        onClick: function () {
                            var rotation = new doric.RotationAnimation;
                            rotation.duration = 1000;
                            rotation.fromRotation = 0;
                            rotation.toRotation = 4;
                            var translation = new doric.TranslationAnimation;
                            translation.duration = 1000;
                            translation.fromTranslationX = view.translationX || 0;
                            translation.toTranslationX = 100;
                            var animationSet = new doric.AnimationSet;
                            animationSet.addAnimation(rotation);
                            animationSet.addAnimation(translation);
                            view.doAnimation(context, animationSet);
                        }
                    }),
                    thisLabel('rotationX').apply({
                        onClick: function () {
                            var rotation = new doric.RotationXAnimation;
                            rotation.duration = 5000;
                            rotation.fromRotation = 0;
                            rotation.toRotation = 0.5;
                            var animationSet = new doric.AnimationSet;
                            animationSet.addAnimation(rotation);
                            view2.doAnimation(context, animationSet);
                        }
                    }),
                    thisLabel('rotationY').apply({
                        onClick: function () {
                            var rotation = new doric.RotationYAnimation;
                            rotation.duration = 5000;
                            rotation.fromRotation = 0;
                            rotation.toRotation = 4;
                            var animationSet = new doric.AnimationSet;
                            animationSet.addAnimation(rotation);
                            view2.doAnimation(context, animationSet);
                        }
                    }) ], { space: 10 }),
                doric.hlayout([
                    thisLabel('Default').apply({
                        onClick: function () {
                            var translation = new doric.TranslationAnimation;
                            translation.duration = 3000;
                            translation.fromTranslationX = 0;
                            translation.toTranslationX = 300;
                            translation.timingFunction = doric.TimingFunction.Default;
                            view.doAnimation(context, translation);
                        }
                    }),
                    thisLabel('Linear').apply({
                        onClick: function () {
                            var translation = new doric.TranslationAnimation;
                            translation.duration = 3000;
                            translation.fromTranslationX = 0;
                            translation.toTranslationX = 300;
                            translation.timingFunction = doric.TimingFunction.Linear;
                            view.doAnimation(context, translation);
                        }
                    }),
                    thisLabel('EaseIn').apply({
                        onClick: function () {
                            var translation = new doric.TranslationAnimation;
                            translation.duration = 3000;
                            translation.fromTranslationX = 0;
                            translation.toTranslationX = 300;
                            translation.timingFunction = doric.TimingFunction.EaseIn;
                            view.doAnimation(context, translation);
                        }
                    }),
                    thisLabel('EaseOut').apply({
                        onClick: function () {
                            var translation = new doric.TranslationAnimation;
                            translation.duration = 3000;
                            translation.fromTranslationX = 0;
                            translation.toTranslationX = 300;
                            translation.timingFunction = doric.TimingFunction.EaseOut;
                            view.doAnimation(context, translation);
                        }
                    }),
                    thisLabel('EaseInEaseOut').apply({
                        onClick: function () {
                            var translation = new doric.TranslationAnimation;
                            translation.duration = 3000;
                            translation.fromTranslationX = 0;
                            translation.toTranslationX = 300;
                            translation.timingFunction = doric.TimingFunction.EaseInEaseOut;
                            view.doAnimation(context, translation);
                        }
                    }) ], { space: 10 }) ], { space: 10 }),
            doric.stack([
                view.also(function (v) {
                    v.x = 20;
                    v.y = 0;
                    v.width = 30;
                    v.left = 15;
                }),
                view2.also(function (v) {
                    v.x = v.y = 20;
                    v.y = 40;
                    //v.scaleX = 1.5
                })
            ], {
                layoutConfig: doric.layoutConfig().most(),
                backgroundColor: colors[1].alpha(0.3 * 255),
            }) ], {
            layoutConfig: doric.layoutConfig().most(),
            gravity: doric.gravity().center(),
            space: 10,
        }).in(rootView);
    };

    return AnimationDemo;
}(doric.Panel));
AnimationDemo = __decorate([
    Entry
], AnimationDemo);
//# sourceMappingURL=ComplicatedAnimations.es5.js.map
