import { BridgeContext } from "../runtime/global";
export declare function storage(context: BridgeContext): {
    setItem: (key: string, value: string, zone?: string) => Promise<any>;
    getItem: (key: string, zone?: string) => Promise<string>;
    remove: (key: string, zone?: string) => Promise<any>;
    clear: (zone: string) => Promise<any>;
};
