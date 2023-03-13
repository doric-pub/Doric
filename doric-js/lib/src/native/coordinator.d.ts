import { BridgeContext } from "../runtime/global";
import { Scroller } from "../widget/scroller";
import { List } from "../widget/list";
import { FlowLayout } from "../widget/flowlayout";
import { View } from "../ui/view";
import { Color } from "../util/color";
export declare function coordinator(context: BridgeContext): {
    verticalScrolling: (argument: {
        scrollable: Scroller | List | FlowLayout;
        scrollRange: {
            start: number;
            end: number;
        };
        target: View | "NavBar";
        changing: {
            name: "backgroundColor" | "width" | "height" | "x" | "y" | "alpha";
            start: number | Color;
            end: number | Color;
        };
    }) => void;
    observeScrollingInterval: (argument: {
        scrollable: Scroller | List | FlowLayout;
        observingInterval: number[];
        inclusive?: "Left" | "Right" | undefined;
        onScrolledInterval: (n: number) => void;
    }) => void;
};
