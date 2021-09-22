import { View } from "../ui/view";
import { Stack } from "../widget/layouts";
export declare enum SwipeOrientation {
    LEFT = 0,
    RIGHT = 1,
    TOP = 2,
    BOTTOM = 3
}
export declare class GestureContainer extends Stack {
    onSingleTap?: () => void;
    onDoubleTap?: () => void;
    onLongPress?: () => void;
    /**
     * Called when the fingers in pinching on screen
     * @param scale: the numeric value of scale on pinch
     */
    onPinch?: (scale: number) => void;
    /**
     * Called when the fingers are scrolling or paning
     * @param dx: the value of the change on the x-axis
     * @param dy: the value of the change on the y-axis
     */
    onPan?: (dx: number, dy: number) => void;
    /**
     * Called when the fingers are scrolling or paning
     * @param dAngle: the value of the angle change from last rotate in radian
     */
    onRotate?: (dAngle: number) => void;
    /**
     * Called when the fingers has swiped on screen
     * @param orientation: the orientation of this swipe
     */
    onSwipe?: (orientation: SwipeOrientation) => void;
    /**
     * Called when the finger touch down on the screen
     * @param x: the value of event occurs on the x-axis
     * @param y: the value of event occurs on the y-axis
     */
    onTouchDown?: (x: number, y: number) => void;
    /**
     * Called when the finger moving on the screen
     * @param x: the value of event occurs on the x-axis
     * @param y: the value of event occurs on the y-axis
     */
    onTouchMove?: (x: number, y: number) => void;
    /**
     * Called when the finger touch up off from the screen
     * @param x: the value of event occurs on the x-axis
     * @param y: the value of event occurs on the y-axis
     */
    onTouchUp?: (x: number, y: number) => void;
    /**
     * Called when the finger leave from screen
     * @param x: the value of event occurs on the x-axis
     * @param y: the value of event occurs on the y-axis
     */
    onTouchCancel?: (x: number, y: number) => void;
}
export declare function gestureContainer(views: View | View[], config?: Partial<GestureContainer>): GestureContainer;
