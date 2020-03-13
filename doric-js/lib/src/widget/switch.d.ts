import { View, IView } from "../ui/view";
import { Color } from "../util/color";
export interface ISwitch extends IView {
    /**
     * True is on ,false is off,defalut is off.
     */
    state?: boolean;
    /**
     * Switch change callback
     */
    onSwitch?: (state: boolean) => void;
    onTintColor?: Color;
    offTintColor?: Color;
    thumbTintColor?: Color;
}
export declare class Switch extends View {
    /**
     * True is on ,false is off,defalut is off.
     */
    state?: boolean;
    onSwitch?: (state: boolean) => void;
    offTintColor?: Color;
    onTintColor?: Color;
    thumbTintColor?: Color;
}
export declare function switchView(config: ISwitch): Switch;
