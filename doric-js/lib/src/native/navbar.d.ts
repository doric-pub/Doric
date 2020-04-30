import { BridgeContext } from "../runtime/global";
import { Color } from "../util/color";
import { View } from "../ui/view";
export declare function navbar(context: BridgeContext): {
    isHidden: () => Promise<boolean>;
    setHidden: (hidden: boolean) => Promise<any>;
    setTitle: (title: string) => Promise<any>;
    setBgColor: (color: Color) => Promise<any>;
    setLeft: (view: View) => Promise<any>;
    setRight: (view: View) => Promise<any>;
    setCenter: (view: View) => Promise<any>;
};
