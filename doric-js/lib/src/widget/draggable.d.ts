import { View } from "../ui/view";
import { IStack, Stack } from "../widget/layouts";
export interface IDraggable extends IStack {
    onDrag?: (x: number, y: number) => void;
}
export declare class Draggable extends Stack implements IDraggable {
    onDrag?: (x: number, y: number) => void;
}
export declare function draggable(config: IDraggable, views: View[]): Draggable;
