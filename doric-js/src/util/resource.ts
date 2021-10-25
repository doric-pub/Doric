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

export class LocalResource extends Resource {
    constructor(path: string) {
        super("local", path);
    }
}

export class RemoteResource extends Resource {
    constructor(url: string) {
        super("remote", url)
    }
}

export class Base64Resource extends Resource {
    constructor(content: string) {
        super("base64", content)
    }
}

/**
 * This is for android platform
 */
export class DrawableResource extends Resource {
    constructor(name: string) {
        super("drawable", name)
    }
}

export class RawResource extends Resource {
    constructor(name: string) {
        super("raw", name)
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
    constructor(fileName: string) {
        super("mainBundle", fileName)
    }
}

export class BundleResource extends Resource {
    constructor(bundleName: string, fileName: string) {
        super("bundle", `${bundleName}://${fileName}`)
    }
}