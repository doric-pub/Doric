import { BridgeContext } from "../runtime/global";
export declare function notification(context: BridgeContext): {
    publish: (args: {
        biz?: string;
        name: string;
        data?: object;
        androidSystem?: boolean;
    }) => Promise<any>;
    subscribe: (args: {
        biz?: string | undefined;
        name: string;
        callback: (data?: any) => void;
        androidSystem?: boolean | undefined;
    }) => Promise<string>;
    unsubscribe: (subscribeId: string) => Promise<any>;
};
