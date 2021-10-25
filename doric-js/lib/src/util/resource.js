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
export class LocalResource extends Resource {
    constructor(path) {
        super("local", path);
    }
}
export class RemoteResource extends Resource {
    constructor(url) {
        super("remote", url);
    }
}
export class Base64Resource extends Resource {
    constructor(content) {
        super("base64", content);
    }
}
/**
 * This is for android platform
 */
export class DrawableResource extends Resource {
    constructor(name) {
        super("drawable", name);
    }
}
export class RawResource extends Resource {
    constructor(name) {
        super("raw", name);
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
