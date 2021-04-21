import { Modeling, Model } from "../util/types";
export declare type AnimatedKey = "translationX" | "translationY" | "scaleX" | "scaleY" | "rotation" | "pivotX" | "pivotY" | "rotationX" | "rotationY";
export declare enum RepeatMode {
    RESTART = 1,
    REVERSE = 2
}
export interface IAnimation extends Modeling {
    duration: number;
    delay?: number;
    id: string;
}
export interface Changeable {
    fromValue: number;
    toValue: number;
    key: AnimatedKey;
    repeatCount?: number;
    repeatMode?: RepeatMode;
}
export declare enum FillMode {
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
    Both = 3
}
export declare enum TimingFunction {
    /**
     * The system default timing function. Use this function to ensure that the timing of your animations matches that of most system animations.
     */
    Default = 0,
    /**
     * Linear pacing, which causes an animation to occur evenly over its duration.
     */
    Linear = 1,
    /**
     * Ease-in pacing, which causes an animation to begin slowly and then speed up as it progresses.
     */
    EaseIn = 2,
    /**
     * Ease-out pacing, which causes an animation to begin quickly and then slow as it progresses.
     */
    EaseOut = 3,
    /**
     * Ease-in-ease-out pacing, which causes an animation to begin slowly, accelerate through the middle of its duration, and then slow again before completing.
     */
    EaseInEaseOut = 4
}
declare abstract class Animation implements IAnimation {
    changeables: Map<AnimatedKey, Changeable>;
    duration: number;
    repeatCount?: number;
    repeatMode?: RepeatMode;
    delay?: number;
    fillMode: FillMode;
    timingFunction?: TimingFunction;
    id: string;
    toModel(): {
        type: string;
        delay: number | undefined;
        duration: number;
        changeables: {
            key: AnimatedKey;
            fromValue: number;
            toValue: number;
        }[];
        repeatCount: number | undefined;
        repeatMode: RepeatMode | undefined;
        fillMode: FillMode;
        timingFunction: TimingFunction | undefined;
        id: string;
    };
}
export declare class ScaleAnimation extends Animation {
    private scaleXChangeable;
    private scaleYChangeable;
    constructor();
    set fromScaleX(v: number);
    get fromScaleX(): number;
    set toScaleX(v: number);
    get toScaleX(): number;
    set fromScaleY(v: number);
    get fromScaleY(): number;
    set toScaleY(v: number);
    get toScaleY(): number;
}
export declare class TranslationAnimation extends Animation {
    private translationXChangeable;
    private translationYChangeable;
    constructor();
    set fromTranslationX(v: number);
    get fromTranslationX(): number;
    set toTranslationX(v: number);
    get toTranslationX(): number;
    set fromTranslationY(v: number);
    get fromTranslationY(): number;
    set toTranslationY(v: number);
    get toTranslationY(): number;
}
export declare class RotationAnimation extends Animation {
    private rotationChaneable;
    constructor();
    set fromRotation(v: number);
    get fromRotation(): number;
    set toRotation(v: number);
    get toRotation(): number;
}
export declare class RotationXAnimation extends Animation {
    private rotationChaneable;
    constructor();
    set fromRotation(v: number);
    get fromRotation(): number;
    set toRotation(v: number);
    get toRotation(): number;
}
export declare class RotationYAnimation extends Animation {
    private rotationChaneable;
    constructor();
    set fromRotation(v: number);
    get fromRotation(): number;
    set toRotation(v: number);
    get toRotation(): number;
}
export declare class AnimationSet implements IAnimation {
    private animations;
    private _duration;
    delay?: number;
    id: string;
    addAnimation(anim: IAnimation): void;
    get duration(): number;
    set duration(v: number);
    toModel(): {
        animations: Model;
        delay: number | undefined;
        id: string;
    };
}
export {};
