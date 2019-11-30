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
    RESTART,
    REVERSE,
}
export interface IAnimation extends Modeling {
    repeatCount?: number
    repeatMode?: RepeatMode
    duration: number
    delay?: number
}

export interface Changeable {
    fromValue: number
    toValue: number
    key: AnimatedKey
}

abstract class Animation implements IAnimation {
    changeables: Map<AnimatedKey, Changeable> = new Map
    duration = 0
    repeatCount?: number
    repeatMode?: RepeatMode
    delay?: number

    toModel() {
        const ret = []
        for (let e of this.changeables.values()) {
            ret.push({
                repeatCount: this.repeatCount,
                repeatMode: this.repeatMode,
                delay: this.delay,
                duration: this.duration,
                key: e.key,
                fromValue: e.fromValue,
                toValue: e.toValue,
            })
        }
        return ret
    }
}

export class ScaleAnimation extends Animation {
    private scaleXChaneable: Changeable = {
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
        this.changeables.set("scaleX", this.scaleXChaneable)
        this.changeables.set("scaleY", this.scaleXChaneable)
    }


    set fromScaleX(v: number) {
        this.scaleXChaneable.fromValue = v
    }

    get fromScaleX() {
        return this.scaleXChaneable.fromValue
    }

    set toScaleX(v: number) {
        this.scaleXChaneable.toValue = v
    }

    get toScaleX() {
        return this.scaleXChaneable.toValue
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

export class AnimaionSet implements IAnimation {
    animations: IAnimation[] = []
    _duration = 0

    repeatCount?: number
    repeatMode?: RepeatMode
    delay?: number

    get duration() {
        return this._duration
    }

    set duration(v: number) {
        this._duration = v
        this.animations.forEach(e => e.duration = v)
    }

    toModel() {
        return this.animations.map(e => {
            return e.toModel()
        }) as Model
    }
}