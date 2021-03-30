import { BridgeContext } from "../runtime/global";
export declare function keyboard(context: BridgeContext): {
    subscribe: (callback: (data: {
        oldBottomMargin: number;
        oldHeight: number;
        bottomMargin: number;
        height: number;
    }) => void) => Promise<string>;
    unsubscribe: (subscribeId: string) => Promise<any>;
};
