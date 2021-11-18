import { Resource } from "../util/resource";
import { BridgeContext } from "../runtime/global";
export declare function imageDecoder(context: BridgeContext): {
    getImageInfo: (resource: Resource) => Promise<{
        width: number;
        height: number;
        mimeType: string;
    }>;
    decodeToPixels: (resource: Resource) => Promise<ArrayBuffer>;
};
