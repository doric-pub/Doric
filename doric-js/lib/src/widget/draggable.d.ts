import { View } from "../ui/view";
import { Stack } from "../widget/layouts";
/**
 * @deprecated The class should not be used, please use GestureContainer class instead
 */
export declare class Draggable extends Stack {
    onDrag?: (x: number, y: number) => void;
}
/**
 * @deprecated The function should not be used, please use gestureContainer function instead
 */
export declare function draggable(views: View | View[], config?: Partial<Draggable>): Draggable;
