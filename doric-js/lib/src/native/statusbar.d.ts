import { BridgeContext } from "../runtime/global";
import { Color } from "../util/color";
export declare enum StatusBarMode {
    LIGHT = 0,
    DARK = 1
}
export declare function statusbar(context: BridgeContext): {
    setHidden: (hidden: boolean) => Promise<any>;
    setMode: (mode: StatusBarMode) => Promise<any>;
    setColor: (color: Color) => Promise<any>;
};
