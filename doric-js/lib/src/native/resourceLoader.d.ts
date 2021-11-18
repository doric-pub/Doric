import { Resource } from "../util/resource";
import { BridgeContext } from "../runtime/global";
export declare function resourceLoader(context: BridgeContext): {
    load: (resource: Resource) => Promise<ArrayBuffer>;
};
