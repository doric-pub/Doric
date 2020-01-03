import { BridgeContext } from "../runtime/global";
import { View } from "../ui/view";
export declare function popover(context: BridgeContext): {
    show: (view: View) => Promise<any>;
    dismiss: (view?: View | undefined) => Promise<any>;
};
