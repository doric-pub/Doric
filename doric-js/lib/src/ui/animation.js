/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Color } from "../util/color";
import { uniqueId } from "../util/uniqueId";
export var RepeatMode;
(function (RepeatMode) {
    RepeatMode[RepeatMode["RESTART"] = 1] = "RESTART";
    RepeatMode[RepeatMode["REVERSE"] = 2] = "REVERSE";
})(RepeatMode || (RepeatMode = {}));
export var FillMode;
(function (FillMode) {
    /**
     * The receiver is removed from the presentation when the animation is completed.
     */
    FillMode[FillMode["Removed"] = 0] = "Removed";
    /**
     * The receiver remains visible in its final state when the animation is completed.
     */
    FillMode[FillMode["Forward"] = 1] = "Forward";
    /**
     * The receiver clamps values before zero to zero when the animation is completed.
     */
    FillMode[FillMode["Backward"] = 2] = "Backward";
    /**
     * The receiver clamps values at both ends of the object’s time space
     */
    FillMode[FillMode["Both"] = 3] = "Both";
})(FillMode || (FillMode = {}));
export var TimingFunction;
(function (TimingFunction) {
    /**
     * The system default timing function. Use this function to ensure that the timing of your animations matches that of most system animations.
     */
    TimingFunction[TimingFunction["Default"] = 0] = "Default";
    /**
     * Linear pacing, which causes an animation to occur evenly over its duration.
     */
    TimingFunction[TimingFunction["Linear"] = 1] = "Linear";
    /**
     * Ease-in pacing, which causes an animation to begin slowly and then speed up as it progresses.
     */
    TimingFunction[TimingFunction["EaseIn"] = 2] = "EaseIn";
    /**
     * Ease-out pacing, which causes an animation to begin quickly and then slow as it progresses.
     */
    TimingFunction[TimingFunction["EaseOut"] = 3] = "EaseOut";
    /**
     * Ease-in-ease-out pacing, which causes an animation to begin slowly, accelerate through the middle of its duration, and then slow again before completing.
     */
    TimingFunction[TimingFunction["EaseInEaseOut"] = 4] = "EaseInEaseOut";
})(TimingFunction || (TimingFunction = {}));
class Animation {
    constructor() {
        this.changeables = new Map;
        this.duration = 0;
        this.fillMode = FillMode.Forward;
        this.id = uniqueId("Animation");
    }
    toModel() {
        const changeables = [];
        for (let e of this.changeables.values()) {
            changeables.push({
                key: e.key,
                fromValue: e.fromValue,
                toValue: e.toValue,
                keyFrames: e.keyFrames,
            });
        }
        return {
            type: this.constructor.name,
            delay: this.delay,
            duration: this.duration,
            changeables,
            repeatCount: this.repeatCount,
            repeatMode: this.repeatMode,
            fillMode: this.fillMode,
            timingFunction: this.timingFunction,
            id: this.id,
        };
    }
}
export class ScaleAnimation extends Animation {
    constructor() {
        super();
        this.scaleXChangeable = {
            key: "scaleX",
            fromValue: 1,
            toValue: 1,
        };
        this.scaleYChangeable = {
            key: "scaleY",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("scaleX", this.scaleXChangeable);
        this.changeables.set("scaleY", this.scaleYChangeable);
    }
    set xKeyFrames(keyFrames) {
        this.scaleXChangeable.keyFrames = keyFrames;
    }
    set yKeyFrames(keyFrames) {
        this.scaleYChangeable.keyFrames = keyFrames;
    }
    set fromScaleX(v) {
        this.scaleXChangeable.fromValue = v;
    }
    get fromScaleX() {
        return this.scaleXChangeable.fromValue;
    }
    set toScaleX(v) {
        this.scaleXChangeable.toValue = v;
    }
    get toScaleX() {
        return this.scaleXChangeable.toValue;
    }
    set fromScaleY(v) {
        this.scaleYChangeable.fromValue = v;
    }
    get fromScaleY() {
        return this.scaleYChangeable.fromValue;
    }
    set toScaleY(v) {
        this.scaleYChangeable.toValue = v;
    }
    get toScaleY() {
        return this.scaleYChangeable.toValue;
    }
}
export class TranslationAnimation extends Animation {
    constructor() {
        super();
        this.translationXChangeable = {
            key: "translationX",
            fromValue: 0,
            toValue: 0,
        };
        this.translationYChangeable = {
            key: "translationY",
            fromValue: 0,
            toValue: 0,
        };
        this.changeables.set("translationX", this.translationXChangeable);
        this.changeables.set("translationY", this.translationYChangeable);
    }
    set xKeyFrames(keyFrames) {
        this.translationXChangeable.keyFrames = keyFrames;
    }
    set yKeyFrames(keyFrames) {
        this.translationYChangeable.keyFrames = keyFrames;
    }
    set fromTranslationX(v) {
        this.translationXChangeable.fromValue = v;
    }
    get fromTranslationX() {
        return this.translationXChangeable.fromValue;
    }
    set toTranslationX(v) {
        this.translationXChangeable.toValue = v;
    }
    get toTranslationX() {
        return this.translationXChangeable.toValue;
    }
    set fromTranslationY(v) {
        this.translationYChangeable.fromValue = v;
    }
    get fromTranslationY() {
        return this.translationYChangeable.fromValue;
    }
    set toTranslationY(v) {
        this.translationYChangeable.toValue = v;
    }
    get toTranslationY() {
        return this.translationYChangeable.toValue;
    }
}
/**
 * Rotation range is [0..2]
 */
export class RotationAnimation extends Animation {
    constructor() {
        super();
        this.rotationChaneable = {
            key: "rotation",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("rotation", this.rotationChaneable);
    }
    set fromRotation(v) {
        this.rotationChaneable.fromValue = v;
    }
    get fromRotation() {
        return this.rotationChaneable.fromValue;
    }
    set toRotation(v) {
        this.rotationChaneable.toValue = v;
    }
    get toRotation() {
        return this.rotationChaneable.toValue;
    }
    set keyFrames(keyFrames) {
        this.rotationChaneable.keyFrames = keyFrames;
    }
}
/**
 * Rotation range is [0..2]
 */
export class RotationXAnimation extends Animation {
    constructor() {
        super();
        this.rotationChaneable = {
            key: "rotationX",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("rotationX", this.rotationChaneable);
    }
    set fromRotation(v) {
        this.rotationChaneable.fromValue = v;
    }
    get fromRotation() {
        return this.rotationChaneable.fromValue;
    }
    set toRotation(v) {
        this.rotationChaneable.toValue = v;
    }
    get toRotation() {
        return this.rotationChaneable.toValue;
    }
    set keyFrames(keyFrames) {
        this.rotationChaneable.keyFrames = keyFrames;
    }
}
/**
 * Rotation range is [0..2]
 */
export class RotationYAnimation extends Animation {
    constructor() {
        super();
        this.rotationChaneable = {
            key: "rotationY",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("rotationY", this.rotationChaneable);
    }
    set fromRotation(v) {
        this.rotationChaneable.fromValue = v;
    }
    get fromRotation() {
        return this.rotationChaneable.fromValue;
    }
    set toRotation(v) {
        this.rotationChaneable.toValue = v;
    }
    get toRotation() {
        return this.rotationChaneable.toValue;
    }
    set keyFrames(keyFrames) {
        this.rotationChaneable.keyFrames = keyFrames;
    }
}
export class BackgroundColorAnimation extends Animation {
    constructor() {
        super();
        this.backgroundColorChangeable = {
            key: "backgroundColor",
            fromValue: Color.TRANSPARENT._value,
            toValue: Color.TRANSPARENT._value,
        };
        this.changeables.set("backgroundColor", this.backgroundColorChangeable);
    }
    set fromColor(color) {
        this.backgroundColorChangeable.fromValue = color._value;
    }
    get fromColor() {
        return new Color(this.backgroundColorChangeable.fromValue);
    }
    set toColor(v) {
        this.backgroundColorChangeable.toValue = v._value;
    }
    get toColor() {
        return new Color(this.backgroundColorChangeable.toValue);
    }
    set keyFrames(keyFrames) {
        this.backgroundColorChangeable.keyFrames = keyFrames.map(e => { return { percent: e.percent, value: e.value.toModel() }; });
    }
}
/**
 * Alpha range is [0..1]
 */
export class AlphaAnimation extends Animation {
    constructor() {
        super();
        this.opacityChangeable = {
            key: "alpha",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("alpha", this.opacityChangeable);
    }
    set from(v) {
        this.opacityChangeable.fromValue = v;
    }
    get from() {
        return this.opacityChangeable.fromValue;
    }
    set to(v) {
        this.opacityChangeable.toValue = v;
    }
    get to() {
        return this.opacityChangeable.toValue;
    }
    set keyFrames(keyFrames) {
        this.opacityChangeable.keyFrames = keyFrames;
    }
}
export class AnimationSet {
    constructor() {
        this.animations = [];
        this._duration = 0;
        this.id = uniqueId("AnimationSet");
    }
    addAnimation(anim) {
        this.animations.push(anim);
    }
    get duration() {
        return this._duration;
    }
    set duration(v) {
        this._duration = v;
        this.animations.forEach(e => e.duration = v);
    }
    toModel() {
        return {
            animations: this.animations.map(e => {
                return e.toModel();
            }),
            delay: this.delay,
            id: this.id,
        };
    }
}
