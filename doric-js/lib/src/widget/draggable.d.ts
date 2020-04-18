import { View } from "../ui/view";
import { Stack } from "../widget/layouts";
export declare class Draggable extends Stack {
    onDrag?: (x: number, y: number) => void;
}
export declare function draggable(views: View | View[], config?: Partial<Draggable>): Draggable;
