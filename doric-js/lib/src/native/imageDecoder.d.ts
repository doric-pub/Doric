import { Resource } from "../util/resource";
import { BridgeContext } from "../runtime/global";
export declare function imageDecoder(context: BridgeContext): {
    getBitmapInfo: (resource: Resource) => Promise<ArrayBuffer>;
    decodeToPixels: (resource: Resource) => Promise<ArrayBuffer>;
};
