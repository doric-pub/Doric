import { BridgeContext } from "../runtime/global";
export declare function notification(context: BridgeContext): {
    publish: (args: {
        biz: string;
        name: string;
        data?: object | undefined;
        androidSystem?: boolean | undefined;
    }) => Promise<any>;
    subscribe: (args: {
        biz: string;
        name: string;
        callback: (data?: object | undefined) => void;
        androidSystem?: boolean | undefined;
    }) => Promise<string>;
    unsubscribe: (subscribeId: string) => Promise<any>;
};
