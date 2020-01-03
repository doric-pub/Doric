import { View, IView } from "../ui/view";
import { Color } from "../util/color";
import { Gravity } from "../util/gravity";
import { BridgeContext } from "../runtime/global";
export interface IInput extends IView {
    text?: string;
    textColor?: Color;
    textSize?: number;
    hintText?: string;
    hintTextColor?: Color;
    multilines?: boolean;
    textAlignment?: Gravity;
    onTextChange?: (text: string) => void;
    onFocusChange?: (focused: boolean) => void;
}
export declare class Input extends View implements IInput {
    text?: string;
    textColor?: Color;
    textSize?: number;
    hintText?: string;
    hintTextColor?: Color;
    multiline?: boolean;
    textAlignment?: Gravity;
    onTextChange?: (text: string) => void;
    onFocusChange?: (focused: boolean) => void;
    getText(context: BridgeContext): Promise<string>;
    setSelection(context: BridgeContext, start: number, end?: number): Promise<string>;
    requestFocus(context: BridgeContext): Promise<any>;
    releaseFocus(context: BridgeContext): Promise<any>;
}
export declare function input(config: IInput): Input;
