import { Modeling } from "./types";
export declare abstract class Resource implements Modeling {
    type: string;
    identifier: string;
    constructor(type: string, identifier: string);
    toModel(): {
        type: string;
        identifier: string;
    };
}
export declare class FileResource extends Resource {
    constructor(path: string);
}
export declare class RemoteResource extends Resource {
    constructor(url: string);
}
export declare class Base64Resource extends Resource {
    constructor(url: string);
}
/**
 * This is for android platform
 */
export declare class DrawableResource extends Resource {
    constructor(url: string);
}
export declare class RawResource extends Resource {
    constructor(url: string);
}
export declare class AssetResource extends Resource {
    constructor(path: string);
}
/**
 * This is for iOS platform
 */
export declare class MainBundleResource extends Resource {
    constructor(path: string);
}
