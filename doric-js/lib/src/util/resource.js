export class Resource {
    constructor(type, identifier) {
        this.type = type;
        this.identifier = identifier;
    }
    toModel() {
        return {
            type: this.type,
            identifier: this.identifier,
        };
    }
}
export class FileResource extends Resource {
    constructor(path) {
        super("file", path);
    }
}
export class RemoteResource extends Resource {
    constructor(url) {
        super("remote", url);
    }
}
/**
 * This is for android platform
 */
export class DrawableResource extends Resource {
    constructor(url) {
        super("drawable", url);
    }
}
export class AssetResource extends Resource {
    constructor(path) {
        super("assets", path);
    }
}
/**
 * This is for iOS platform
 */
export class MainBundleResource extends Resource {
    constructor(path) {
        super("mainBundle", path);
    }
}
