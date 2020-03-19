import { BridgeContext } from "../runtime/global";
export declare function notch(context: BridgeContext): {
    inset: () => Promise<{
        top: number;
        left: number;
        bottom: number;
        right: number;
    }>;
};
