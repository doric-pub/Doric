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
var PathButtonDemo = /*@__PURE__*/(function (Panel) {
    function PathButtonDemo() {
        Panel.apply(this, arguments);
        this.collapse = false;
    }

    if ( Panel ) PathButtonDemo.__proto__ = Panel;
    PathButtonDemo.prototype = Object.create( Panel && Panel.prototype );
    PathButtonDemo.prototype.constructor = PathButtonDemo;
    PathButtonDemo.prototype.build = function build (root) {
        var this$1 = this;

        var clockWise = function () { return __awaiter(this$1, void 0, void 0, function* () {
            var this$1 = this;

            var _a, _b, _c, _d;
            (_a = this.menu1) === null || _a === void 0 ? void 0 : _a.let(function (it) {
                it.scaleX = 0;
                it.scaleY = 0;
            });
            (_b = this.menu2) === null || _b === void 0 ? void 0 : _b.let(function (it) {
                it.scaleX = 0;
                it.scaleY = 0;
            });
            (_c = this.menu3) === null || _c === void 0 ? void 0 : _c.let(function (it) {
                it.scaleX = 0;
                it.scaleY = 0;
            });
            (_d = this.menu4) === null || _d === void 0 ? void 0 : _d.let(function (it) {
                it.scaleX = 0;
                it.scaleY = 0;
            });
            yield doric.animate(context)({
                animations: function () {
                    var _a, _b, _c, _d, _e;
                    (_a = this$1.dock) === null || _a === void 0 ? void 0 : _a.let(function (it) { it.rotation = 0.5; });
                    (_b = this$1.menu1) === null || _b === void 0 ? void 0 : _b.let(function (it) {
                        it.translationX = -150;
                        it.scaleX = 1;
                        it.scaleY = 1;
                    });
                    (_c = this$1.menu2) === null || _c === void 0 ? void 0 : _c.let(function (it) {
                        it.translationY = -150;
                        it.scaleX = 1;
                        it.scaleY = 1;
                    });
                    (_d = this$1.menu3) === null || _d === void 0 ? void 0 : _d.let(function (it) {
                        it.translationX = -150 * Math.cos(1 / 6 * Math.PI);
                        it.translationY = -150 * Math.sin(1 / 6 * Math.PI);
                        it.scaleX = 1;
                        it.scaleY = 1;
                    });
                    (_e = this$1.menu4) === null || _e === void 0 ? void 0 : _e.let(function (it) {
                        it.translationX = -150 * Math.cos(1 / 3 * Math.PI);
                        it.translationY = -150 * Math.sin(1 / 3 * Math.PI);
                        it.scaleX = 1;
                        it.scaleY = 1;
                    });
                },
                duration: 300,
            });
        }); };
        var antiClockWise = function () { return __awaiter(this$1, void 0, void 0, function* () {
            var this$1 = this;

            yield doric.animate(context)({
                animations: function () {
                    var _a, _b, _c, _d, _e;
                    (_a = this$1.dock) === null || _a === void 0 ? void 0 : _a.let(function (it) { it.rotation = 0; });
                    (_b = this$1.menu1) === null || _b === void 0 ? void 0 : _b.let(function (it) {
                        it.translationX = 0;
                        it.scaleX = 0;
                        it.scaleY = 0;
                    });
                    (_c = this$1.menu2) === null || _c === void 0 ? void 0 : _c.let(function (it) {
                        it.translationY = 0;
                        it.scaleX = 0;
                        it.scaleY = 0;
                    });
                    (_d = this$1.menu3) === null || _d === void 0 ? void 0 : _d.let(function (it) {
                        it.translationX = 0;
                        it.translationY = 0;
                        it.scaleX = 0;
                        it.scaleY = 0;
                    });
                    (_e = this$1.menu4) === null || _e === void 0 ? void 0 : _e.let(function (it) {
                        it.translationX = 0;
                        it.translationY = 0;
                        it.scaleX = 0;
                        it.scaleY = 0;
                    });
                },
                duration: 300,
            });
        }); };
        doric.stack([
            this.menu1 = doric.stack([], {
                width: 50,
                height: 50,
                layoutConfig: doric.layoutConfig().just(),
                corners: 25,
                backgroundColor: doric.Color.RED,
                x: Environment.screenWidth - 100,
                y: Environment.screenHeight - 140,
            }),
            this.menu2 = doric.stack([], {
                width: 50,
                height: 50,
                layoutConfig: doric.layoutConfig().just(),
                corners: 25,
                backgroundColor: doric.Color.RED,
                x: Environment.screenWidth - 100,
                y: Environment.screenHeight - 140,
            }),
            this.menu3 = doric.stack([], {
                width: 50,
                height: 50,
                layoutConfig: doric.layoutConfig().just(),
                corners: 25,
                backgroundColor: doric.Color.RED,
                x: Environment.screenWidth - 100,
                y: Environment.screenHeight - 140,
            }),
            this.menu4 = doric.stack([], {
                width: 50,
                height: 50,
                layoutConfig: doric.layoutConfig().just(),
                corners: 25,
                backgroundColor: doric.Color.RED,
                x: Environment.screenWidth - 100,
                y: Environment.screenHeight - 140,
            }),
            this.dock = doric.text({
                text: '+',
                textColor: doric.Color.WHITE,
                textSize: 40,
                textAlignment: doric.Gravity.Center,
                layoutConfig: doric.layoutConfig().just(),
                backgroundColor: doric.Color.RED,
                corners: 25,
                x: Environment.screenWidth - 100,
                y: Environment.screenHeight - 140,
                width: 50,
                height: 50,
                onClick: function () {
                    this$1.collapse = !this$1.collapse;
                    if (this$1.collapse) {
                        clockWise();
                    }
                    else {
                        antiClockWise();
                    }
                }
            }) ], {
            backgroundColor: colors[0],
            layoutConfig: doric.layoutConfig().most(),
        }).in(root);
    };

    return PathButtonDemo;
}(doric.Panel));
PathButtonDemo = __decorate([
    Entry
], PathButtonDemo);
//# sourceMappingURL=PathButtonDemo.es5.js.map
