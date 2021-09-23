/*
 * Copyright [2021] [Doric.Pub]
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
import { Property, View } from "../ui/view"
import { Stack } from "../widget/layouts"
import { layoutConfig } from "../util/layoutconfig"

export enum SwipeOrientation {
    LEFT, RIGHT, TOP, BOTTOM
}

export class GestureContainer extends Stack {
    @Property
    onSingleTap?: () => void

    @Property
    onDoubleTap?: () => void

    @Property
    onLongPress?: () => void

    /**
     * Called when the fingers in pinching on screen
     * @param scale: the numeric value of scale on pinch
     */
    @Property
    onPinch?: (scale: number) => void

    /**
     * Called when the fingers are scrolling or paning
     * @param dx: the value of the change on the x-axis
     * @param dy: the value of the change on the y-axis
     */
    @Property
    onPan?: (dx: number, dy: number) => void

    /**
     * Called when the fingers are scrolling or paning
     * @param dAngle: the value of the angle change from last rotate in radian
     */
    @Property
    onRotate?: (dAngle: number) => void

    /**
     * Called when the fingers has swiped on screen
     * @param orientation: the orientation of this swipe
     */
    @Property
    onSwipe?: (orientation: SwipeOrientation) => void

    /**
     * Called when the finger touch down on the screen
     * @param x: the value of event occurs on the x-axis
     * @param y: the value of event occurs on the y-axis
     */
    @Property
    onTouchDown?: (event: { x: number, y: number }) => void

    /**
     * Called when the finger moving on the screen
     * @param x: the value of event occurs on the x-axis
     * @param y: the value of event occurs on the y-axis
     */
    @Property
    onTouchMove?: (event: { x: number, y: number }) => void

    /**
     * Called when the finger touch up off from the screen
     * @param x: the value of event occurs on the x-axis
     * @param y: the value of event occurs on the y-axis
     */
    @Property
    onTouchUp?: (event: { x: number, y: number }) => void

    /**
     * Called when the finger leave from screen
     * @param x: the value of event occurs on the x-axis
     * @param y: the value of event occurs on the y-axis
     */
    @Property
    onTouchCancel?: (event: { x: number, y: number }) => void
}

export function gestureContainer(views: View | View[], config?: Partial<GestureContainer>) {
    const ret = new GestureContainer
    ret.layoutConfig = layoutConfig().fit()
    if (views instanceof View) {
        ret.addChild(views)
    } else {
        views.forEach(e => {
            ret.addChild(e)
        })
    }
    if (config) {
        ret.apply(config)
    }
    return ret
}