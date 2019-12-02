import { Modeling, Model } from "../util/types"

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


export type AnimatedKey = "translationX" | "translationY" | "scaleX" | "scaleY" | "rotation" | "pivotX" | "pivotY"

export enum RepeatMode {
    RESTART = 1,
    REVERSE = 2,
}

export interface IAnimation extends Modeling {
    duration: number
    delay?: number
    fillMode: FillMode
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
    Forward = 1,
    /**
     * The receiver clamps values before zero to zero when the animation is completed.
     */
    Backward = 2,
    /**
     * The receiver clamps values at both ends of the object’s time space
     */
    Both = 3,
}

abstract class Animation implements IAnimation {
    changeables: Map<AnimatedKey, Changeable> = new Map
    duration = 0
    repeatCount?: number
    repeatMode?: RepeatMode
    delay?: number
    fillMode = FillMode.Forward
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
        fromValue: 1,
        toValue: 1,
    }
    private translationYChangeable: Changeable = {
        key: "translationY",
        fromValue: 1,
        toValue: 1,
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

export class AnimationSet implements IAnimation {
    private animations: IAnimation[] = []
    _duration = 0
    delay?: number
    fillMode = FillMode.Removed
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
            fillMode: this.fillMode,
            delay: this.delay,
        }
    }
}