import { BridgeContext } from "../runtime/global";
import { Color } from "../util/color";
export declare function navbar(context: BridgeContext): {
    isHidden: () => Promise<boolean>;
    setHidden: (hidden: boolean) => Promise<any>;
    setTitle: (title: string) => Promise<any>;
    setBgColor: (color: Color) => Promise<any>;
};
