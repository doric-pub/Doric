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
let PathButtonDemo = class PathButtonDemo extends doric.Panel {
    constructor() {
        super(...arguments);
        this.collapse = false;
    }
    build(root) {
        let clockWise = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            (_a = this.menu1) === null || _a === void 0 ? void 0 : _a.let((it) => {
                it.scaleX = 0;
                it.scaleY = 0;
            });
            (_b = this.menu2) === null || _b === void 0 ? void 0 : _b.let((it) => {
                it.scaleX = 0;
                it.scaleY = 0;
            });
            (_c = this.menu3) === null || _c === void 0 ? void 0 : _c.let((it) => {
                it.scaleX = 0;
                it.scaleY = 0;
            });
            (_d = this.menu4) === null || _d === void 0 ? void 0 : _d.let((it) => {
                it.scaleX = 0;
                it.scaleY = 0;
            });
            yield doric.animate(context)({
                animations: () => {
                    var _a, _b, _c, _d, _e;
                    (_a = this.dock) === null || _a === void 0 ? void 0 : _a.let((it) => { it.rotation = 0.5; });
                    (_b = this.menu1) === null || _b === void 0 ? void 0 : _b.let((it) => {
                        it.translationX = -150;
                        it.scaleX = 1;
                        it.scaleY = 1;
                    });
                    (_c = this.menu2) === null || _c === void 0 ? void 0 : _c.let((it) => {
                        it.translationY = -150;
                        it.scaleX = 1;
                        it.scaleY = 1;
                    });
                    (_d = this.menu3) === null || _d === void 0 ? void 0 : _d.let((it) => {
                        it.translationX = -150 * Math.cos(1 / 6 * Math.PI);
                        it.translationY = -150 * Math.sin(1 / 6 * Math.PI);
                        it.scaleX = 1;
                        it.scaleY = 1;
                    });
                    (_e = this.menu4) === null || _e === void 0 ? void 0 : _e.let((it) => {
                        it.translationX = -150 * Math.cos(1 / 3 * Math.PI);
                        it.translationY = -150 * Math.sin(1 / 3 * Math.PI);
                        it.scaleX = 1;
                        it.scaleY = 1;
                    });
                },
                duration: 300,
            });
        });
        let antiClockWise = () => __awaiter(this, void 0, void 0, function* () {
            yield doric.animate(context)({
                animations: () => {
                    var _a, _b, _c, _d, _e;
                    (_a = this.dock) === null || _a === void 0 ? void 0 : _a.let((it) => { it.rotation = 0; });
                    (_b = this.menu1) === null || _b === void 0 ? void 0 : _b.let((it) => {
                        it.translationX = 0;
                        it.scaleX = 0;
                        it.scaleY = 0;
                    });
                    (_c = this.menu2) === null || _c === void 0 ? void 0 : _c.let((it) => {
                        it.translationY = 0;
                        it.scaleX = 0;
                        it.scaleY = 0;
                    });
                    (_d = this.menu3) === null || _d === void 0 ? void 0 : _d.let((it) => {
                        it.translationX = 0;
                        it.translationY = 0;
                        it.scaleX = 0;
                        it.scaleY = 0;
                    });
                    (_e = this.menu4) === null || _e === void 0 ? void 0 : _e.let((it) => {
                        it.translationX = 0;
                        it.translationY = 0;
                        it.scaleX = 0;
                        it.scaleY = 0;
                    });
                },
                duration: 300,
            });
        });
        var x= Environment.screenWidth - 100;
        var y= Environment.screenHeight - 150;
        doric.stack([
            this.menu1 = doric.stack([], {
                width: 50,
                height: 50,
                layoutConfig: doric.layoutConfig().just(),
                corners: 25,
                backgroundColor: doric.Color.RED,
                x: x,
                y:y,
            }),
            this.menu2 = doric.stack([], {
                width: 50,
                height: 50,
                layoutConfig: doric.layoutConfig().just(),
                corners: 25,
                backgroundColor: doric.Color.RED,
                 x: x,
                               y:y,
            }),
            this.menu3 = doric.stack([], {
                width: 50,
                height: 50,
                layoutConfig: doric.layoutConfig().just(),
                corners: 25,
                backgroundColor: doric.Color.RED,
                x: x,
                              y:y,
            }),
            this.menu4 = doric.stack([], {
                width: 50,
                height: 50,
                layoutConfig: doric.layoutConfig().just(),
                corners: 25,
                backgroundColor: doric.Color.RED,
               x: x,
                             y:y,
            }),
            this.dock = doric.text({
                text: '+',
                textColor: doric.Color.WHITE,
                textSize: 40,
                textAlignment: doric.Gravity.Center,
                layoutConfig: doric.layoutConfig().just(),
                backgroundColor: doric.Color.RED,
                corners: 25,
                x: x,
                              y:y,
                width: 50,
                height: 50,
                onClick: () => {
                    this.collapse = !this.collapse;
                    if (this.collapse) {
                        clockWise();
                    }
                    else {
                        antiClockWise();
                    }
                }
            }),
        ], {
            backgroundColor: colors[0],
            layoutConfig: doric.layoutConfig().most(),
        }).in(root);
    }
};
PathButtonDemo = __decorate([
    Entry
], PathButtonDemo);
//# sourceMappingURL=PathButtonDemo.js.map
