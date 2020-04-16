import { View } from "../ui/view";
import { Color } from "../util/color";
export declare class Switch extends View {
    /**
     * True is on ,false is off,defalut is off.
     */
    state?: boolean;
    /**
     * Switch change callback
     */
    onSwitch?: (state: boolean) => void;
    offTintColor?: Color;
    onTintColor?: Color;
    thumbTintColor?: Color;
}
export declare function switchView(config: Partial<Switch>): Switch;
