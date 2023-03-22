import { BridgeContext } from "../runtime/global";
export declare function notification(context: BridgeContext): {
    /**
     * @param androidSystem: when set true, using global broadcast instead of local broadcast by default
     * @param iosUsingObject: when set true, using object instead of userInfo by default
     */
    publish: (args: {
        biz?: string;
        name: string;
        data?: object;
        androidSystem?: boolean;
        iosUsingObject?: boolean;
        permission?: string;
    }) => Promise<any>;
    /**
     * @param androidSystem: when set true, using global broadcast instead of local broadcast by default
     * @param iosUsingObject: when set true, using object instead of userInfo by default
     */
    subscribe: (args: {
        biz?: string | undefined;
        name: string;
        callback: (data?: any) => void;
        androidSystem?: boolean | undefined;
        iosUsingObject?: boolean | undefined;
        permission?: string | undefined;
    }) => Promise<string>;
    unsubscribe: (subscribeId: string) => Promise<any>;
};
