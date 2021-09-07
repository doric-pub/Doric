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

import { Color } from "../util/color"
import { Modeling, Model } from "../util/types"
import { uniqueId } from "../util/uniqueId"

export type AnimatedKey = "translationX" | "translationY" | "scaleX" | "scaleY" | "rotation" | "pivotX" | "pivotY" | "rotationX" | "rotationY" | "backgroundColor" | "alpha"

export enum RepeatMode {
    RESTART = 1,
    REVERSE = 2,
}

export interface IAnimation extends Modeling {
    duration: number
    delay?: number
    id: string
}

export interface Changeable {
    fromValue: number
    toValue: number
    key: AnimatedKey
    repeatCount?: number
    repeatMode?: RepeatMode
}
export enum FillMode {
    /**
     * The receiver is removed from the presentation when the animation is completed.
     */
    Removed = 0,
    /**
     * The receiver remains visible in its final state when the animation is completed.
     */
    Forward = 0x1,
    /**
     * The receiver clamps values before zero to zero when the animation is completed.
     */
    Backward = 0x2,
    /**
     * The receiver clamps values at both ends of the object’s time space
     */
    Both = 0x3,
}

export enum TimingFunction {
    /**
     * The system default timing function. Use this function to ensure that the timing of your animations matches that of most system animations.
     */
    Default = 0,
    /**
     * Linear pacing, which causes an animation to occur evenly over its duration.
     */
    Linear,
    /**
     * Ease-in pacing, which causes an animation to begin slowly and then speed up as it progresses.
     */
    EaseIn,
    /**
     * Ease-out pacing, which causes an animation to begin quickly and then slow as it progresses.
     */
    EaseOut,
    /**
     * Ease-in-ease-out pacing, which causes an animation to begin slowly, accelerate through the middle of its duration, and then slow again before completing.
     */
    EaseInEaseOut,
}

abstract class Animation implements IAnimation {
    changeables: Map<AnimatedKey, Changeable> = new Map
    duration = 0
    repeatCount?: number
    repeatMode?: RepeatMode
    delay?: number
    fillMode = FillMode.Forward
    timingFunction?: TimingFunction
    id = uniqueId("Animation")
    toModel() {
        const changeables = []
        for (let e of this.changeables.values()) {
            changeables.push({
                key: e.key,
                fromValue: e.fromValue,
                toValue: e.toValue,
            })
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
        }
    }
}

export class ScaleAnimation extends Animation {
    private scaleXChangeable: Changeable = {
        key: "scaleX",
        fromValue: 1,
        toValue: 1,
    }
    private scaleYChangeable: Changeable = {
        key: "scaleY",
        fromValue: 1,
        toValue: 1,
    }
    constructor() {
        super()
        this.changeables.set("scaleX", this.scaleXChangeable)
        this.changeables.set("scaleY", this.scaleYChangeable)
    }


    set fromScaleX(v: number) {
        this.scaleXChangeable.fromValue = v
    }

    get fromScaleX() {
        return this.scaleXChangeable.fromValue
    }

    set toScaleX(v: number) {
        this.scaleXChangeable.toValue = v
    }

    get toScaleX() {
        return this.scaleXChangeable.toValue
    }
    set fromScaleY(v: number) {
        this.scaleYChangeable.fromValue = v
    }

    get fromScaleY() {
        return this.scaleYChangeable.fromValue
    }

    set toScaleY(v: number) {
        this.scaleYChangeable.toValue = v
    }

    get toScaleY() {
        return this.scaleYChangeable.toValue
    }
}

export class TranslationAnimation extends Animation {
    private translationXChangeable: Changeable = {
        key: "translationX",
        fromValue: 0,
        toValue: 0,
    }
    private translationYChangeable: Changeable = {
        key: "translationY",
        fromValue: 0,
        toValue: 0,
    }
    constructor() {
        super()
        this.changeables.set("translationX", this.translationXChangeable)
        this.changeables.set("translationY", this.translationYChangeable)
    }

    set fromTranslationX(v: number) {
        this.translationXChangeable.fromValue = v
    }

    get fromTranslationX() {
        return this.translationXChangeable.fromValue
    }

    set toTranslationX(v: number) {
        this.translationXChangeable.toValue = v
    }

    get toTranslationX() {
        return this.translationXChangeable.toValue
    }
    set fromTranslationY(v: number) {
        this.translationYChangeable.fromValue = v
    }

    get fromTranslationY() {
        return this.translationYChangeable.fromValue
    }

    set toTranslationY(v: number) {
        this.translationYChangeable.toValue = v
    }

    get toTranslationY() {
        return this.translationYChangeable.toValue
    }
}
/**
 * Rotation range is [0..2]
 */
export class RotationAnimation extends Animation {
    private rotationChaneable: Changeable = {
        key: "rotation",
        fromValue: 1,
        toValue: 1,
    }
    constructor() {
        super()
        this.changeables.set("rotation", this.rotationChaneable)
    }

    set fromRotation(v: number) {
        this.rotationChaneable.fromValue = v
    }

    get fromRotation() {
        return this.rotationChaneable.fromValue
    }

    set toRotation(v: number) {
        this.rotationChaneable.toValue = v
    }

    get toRotation() {
        return this.rotationChaneable.toValue
    }
}
/**
 * Rotation range is [0..2]
 */
export class RotationXAnimation extends Animation {
    private rotationChaneable: Changeable = {
        key: "rotationX",
        fromValue: 1,
        toValue: 1,
    }
    constructor() {
        super()
        this.changeables.set("rotationX", this.rotationChaneable)
    }

    set fromRotation(v: number) {
        this.rotationChaneable.fromValue = v
    }

    get fromRotation() {
        return this.rotationChaneable.fromValue
    }

    set toRotation(v: number) {
        this.rotationChaneable.toValue = v
    }

    get toRotation() {
        return this.rotationChaneable.toValue
    }
}
/**
 * Rotation range is [0..2]
 */
export class RotationYAnimation extends Animation {
    private rotationChaneable: Changeable = {
        key: "rotationY",
        fromValue: 1,
        toValue: 1,
    }
    constructor() {
        super()
        this.changeables.set("rotationY", this.rotationChaneable)
    }

    set fromRotation(v: number) {
        this.rotationChaneable.fromValue = v
    }

    get fromRotation() {
        return this.rotationChaneable.fromValue
    }

    set toRotation(v: number) {
        this.rotationChaneable.toValue = v
    }

    get toRotation() {
        return this.rotationChaneable.toValue
    }
}

export class BackgroundColorAnimation extends Animation {
    private backgroundColorChangeable: Changeable = {
        key: "backgroundColor",
        fromValue: Color.TRANSPARENT._value,
        toValue: Color.TRANSPARENT._value,
    }

    constructor() {
        super()
        this.changeables.set("backgroundColor", this.backgroundColorChangeable)
    }

    set fromColor(color: Color) {
        this.backgroundColorChangeable.fromValue = color._value
    }

    get fromColor() {
        return new Color(this.backgroundColorChangeable.fromValue)
    }

    set toColor(v: Color) {
        this.backgroundColorChangeable.toValue = v._value
    }

    get toColor() {
        return new Color(this.backgroundColorChangeable.toValue)
    }
}

/**
 * Alpha range is [0..1]
 */
export class AlphaAnimation extends Animation {
    private opacityChangeable: Changeable = {
        key: "alpha",
        fromValue: 1,
        toValue: 1,
    }

    constructor() {
        super()
        this.changeables.set("alpha", this.opacityChangeable)
    }

    set from(v: number) {
        this.opacityChangeable.fromValue = v
    }

    get from() {
        return this.opacityChangeable.fromValue
    }

    set to(v: number) {
        this.opacityChangeable.toValue = v
    }

    get to() {
        return this.opacityChangeable.toValue
    }
}



export class AnimationSet implements IAnimation {
    private animations: IAnimation[] = []
    private _duration = 0
    delay?: number
    id = uniqueId("AnimationSet")

    addAnimation(anim: IAnimation) {
        this.animations.push(anim)
    }

    get duration() {
        return this._duration
    }

    set duration(v: number) {
        this._duration = v
        this.animations.forEach(e => e.duration = v)
    }

    toModel() {
        return {
            animations: this.animations.map(e => {
                return e.toModel()
            }) as Model,
            delay: this.delay,
            id: this.id,
        }
    }
}