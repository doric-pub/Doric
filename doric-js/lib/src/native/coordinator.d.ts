import { BridgeContext } from "../runtime/global";
import { Scroller } from "../widget/scroller";
import { List } from "../widget/list";
import { FlowLayout } from "../widget/flowlayout";
import { View } from "../ui/view";
import { Color } from "../util/color";
export declare function coordinator(context: BridgeContext): {
    verticalScrolling: (argument: {
        scrollable: List | Scroller | FlowLayout;
        scrollRange: {
            start: number;
            end: number;
        };
        target: View | "NavBar";
        changing: {
            name: "width" | "height" | "x" | "y" | "backgroundColor";
            start: number | Color;
            end: number | Color;
        };
    }) => Promise<any>;
};
