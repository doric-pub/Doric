import { View } from "../ui/view";
import { Color } from "../util/color";
import { Gravity } from "../util/gravity";
import { BridgeContext } from "../runtime/global";
export declare class Input extends View {
    text?: string;
    textColor?: Color;
    textSize?: number;
    hintText?: string;
    inputType?: InputType;
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
export declare enum InputType {
    Default = 0,
    Number = 1,
    Decimal = 2,
    Alphabet = 3,
    Phone = 4
}
export declare function input(config: Partial<Input>): Input;
