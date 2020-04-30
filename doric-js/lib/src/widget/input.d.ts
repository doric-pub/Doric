import { View } from "../ui/view";
import { Color } from "../util/color";
import { Gravity } from "../util/gravity";
import { BridgeContext } from "../runtime/global";
export declare class Input extends View {
    text?: string;
    textColor?: Color;
    textSize?: number;
    hintText?: string;
    hintTextColor?: Color;
    multiline?: boolean;
    textAlignment?: Gravity;
    onTextChange?: (text: string) => void;
    onFocusChange?: (focused: boolean) => void;
    maxLength?: number;
    getText(context: BridgeContext): Promise<string>;
    setSelection(context: BridgeContext, start: number, end?: number): Promise<string>;
    requestFocus(context: BridgeContext): Promise<any>;
    releaseFocus(context: BridgeContext): Promise<any>;
}
export declare function input(config: Partial<Input>): Input;
