import { View } from "../ui/view";
import { Color, GradientColor } from "../util/color";
import { Gravity } from "../util/gravity";
import { Resource } from "../util/resource";
export declare enum TruncateAt {
    End = 0,
    Middle = 1,
    Start = 2,
    Clip = 3
}
export declare class Text extends View implements JSX.ElementChildrenAttribute {
    text?: string;
    textColor?: Color | GradientColor;
    textSize?: number;
    maxLines?: number;
    textAlignment?: Gravity;
    fontStyle?: "normal" | "bold" | "italic" | "bold_italic";
    font?: string | Resource;
    maxWidth?: number;
    maxHeight?: number;
    lineSpacing?: number;
    strikethrough?: boolean;
    underline?: boolean;
    htmlText?: string;
    truncateAt?: TruncateAt;
    set innerElement(e: string);
}
export declare function text(config: Partial<Text>): Text;
