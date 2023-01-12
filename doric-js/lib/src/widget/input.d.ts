import { View } from "../ui/view";
import { Color } from "../util/color";
import { Gravity } from "../util/gravity";
import { BridgeContext } from "../runtime/global";
export declare enum ReturnKeyType {
    Default = 0,
    Done = 1,
    Search = 2,
    Next = 3,
    Go = 4,
    Send = 5
}
export declare class Input extends View {
    text?: string;
    textColor?: Color;
    textSize?: number;
    font?: string;
    hintText?: string;
    hintFont?: string;
    inputType?: InputType;
    hintTextColor?: Color;
    multiline?: boolean;
    textAlignment?: Gravity;
    fontStyle?: "normal" | "bold" | "italic" | "bold_italic";
    onTextChange?: (text?: string) => void;
    onFocusChange?: (focused: boolean) => void;
    maxLength?: number;
    password?: boolean;
    editable?: boolean;
    returnKeyType?: ReturnKeyType;
    onSubmitEditing?: (text?: string) => void;
    enableHorizontalScrollBar?: boolean;
    enableVerticalScrollBar?: boolean;
    /**
     * Called before text is changed
     * @param editing: text already in box
     * @param replacement: text which will replace part of editing
     * @param start: the start index of replacing part
     * @param length: the length of replacing part
     *
     * @returns: true means the replacement will take effect, otherwise does not
     */
    beforeTextChange?: (change: {
        editing?: string;
        start: number;
        length: number;
        replacement?: string;
    }) => boolean;
    padding?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
    getText(context: BridgeContext): Promise<string>;
    setSelection(context: BridgeContext, start: number, end?: number): Promise<any>;
    getSelection(context: BridgeContext): Promise<{
        start: number;
        end: number;
    }>;
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
