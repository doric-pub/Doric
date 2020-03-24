import { IView, View } from "../ui/view";
import { Color } from "../util/color";
import { Gravity } from "../util/gravity";
export interface IText extends IView {
    text?: string;
    textColor?: Color;
    textSize?: number;
    maxLines?: number;
    textAlignment?: Gravity;
    fontStyle?: "normal" | "bold" | "italic" | "bold_italic";
    font?: string;
    maxWidth?: number;
    maxHeight?: number;
    lineSpacing?: number;
}
export declare class Text extends View implements IText {
    text?: string;
    textColor?: Color;
    textSize?: number;
    maxLines?: number;
    textAlignment?: Gravity;
    fontStyle?: "normal" | "bold" | "italic" | "bold_italic";
    font?: string;
    maxWidth?: number;
    maxHeight?: number;
    lineSpacing?: number;
}
export declare function text(config: IText): Text;
