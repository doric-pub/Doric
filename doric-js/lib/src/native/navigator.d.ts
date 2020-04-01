import { BridgeContext } from "../runtime/global";
export declare function navigator(context: BridgeContext): {
    push: (source: string, config?: {
        alias?: string | undefined;
        animated?: boolean | undefined;
        extra?: object | undefined;
    } | undefined) => Promise<any>;
    pop: (animated?: boolean) => Promise<any>;
    openUrl: (url: string) => Promise<any>;
};
