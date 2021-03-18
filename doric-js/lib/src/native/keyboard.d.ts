import { BridgeContext } from "../runtime/global";
export declare function keyboard(context: BridgeContext): {
    subscribe: (callback: (data: {
        height: number;
    }) => void) => Promise<string>;
    unsubscribe: (subscribeId: string) => Promise<any>;
};
