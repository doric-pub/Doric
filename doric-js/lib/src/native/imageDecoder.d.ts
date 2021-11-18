import { Resource } from "../util/resource";
import { BridgeContext } from "../runtime/global";
export declare function imageDecoder(context: BridgeContext): {
    decode: (resource: Resource) => Promise<{
        width: number;
        height: number;
        format: string;
    }>;
};
