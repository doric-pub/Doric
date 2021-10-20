import { Modeling } from "./types";

export abstract class Resource implements Modeling {
    type: string;
    identifier: string;
    constructor(type: string, identifier: string) {
        this.type = type;
        this.identifier = identifier;
    }
    toModel() {
        return {
            type: this.type,
            identifier: this.identifier,
        }
    }
}

export class FileResource extends Resource {
    constructor(path: string) {
        super("file", path);
    }
}

export class RemoteResource extends Resource {
    constructor(url: string) {
        super("remote", url)
    }
}

/**
 * This is for android platform
 */
export class DrawableResource extends Resource {
    constructor(url: string) {
        super("drawable", url)
    }
}
export class RawResource extends Resource {
    constructor(url: string) {
        super("raw", url)
    }
}

export class AssetResource extends Resource {
    constructor(path: string) {
        super("assets", path)
    }
}

/**
 * This is for iOS platform
 */
export class MainBundleResource extends Resource {
    constructor(path: string) {
        super("mainBundle", path)
    }
}