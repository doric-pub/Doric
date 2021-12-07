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
 * Resources belong to assets dir.
 */
export class AssetsResource extends Resource {
    constructor(content) {
        super("doric_assets", content);
    }
}
export class AndroidResource extends Resource {
}
export class iOSResource extends Resource {
}
/**
 * This is for android platform
 */
export class DrawableResource extends AndroidResource {
    constructor(name) {
        super("drawable", name);
    }
}
export class RawResource extends AndroidResource {
    constructor(name) {
        super("raw", name);
    }
}
export class AndroidAssetsResource extends AndroidResource {
    constructor(path) {
        super("android_assets", path);
    }
}
/**
 * This is for iOS platform
 */
export class MainBundleResource extends iOSResource {
    constructor(fileName) {
        super("mainBundle", fileName);
    }
}
export class BundleResource extends iOSResource {
    constructor(bundleName, fileName) {
        super("bundle", `${bundleName}://${fileName}`);
    }
}
