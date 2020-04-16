import { View } from "../ui/view";
import { Color } from "../util/color";
import { Gravity } from "../util/gravity";
export declare class Text extends View {
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
    strikethrough?: boolean;
    underline?: boolean;
    htmlText?: string;
}
export declare function text(config: Partial<Text>): Text;
