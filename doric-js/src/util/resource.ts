import { Modeling } from "./types";
import { uniqueId } from "./uniqueId";

export abstract class Resource implements Modeling {
    type: string;
    identifier: string;
    resId = uniqueId("resource");
    constructor(type: string, identifier: string) {
        this.type = type;
        this.identifier = identifier;
    }
    toModel() {
        return {
            resId: this.resId,
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
    headers?: Record<string, string>

    constructor(url: string) {
        super("remote", url)
    }

    toModel() {
        return {
            ...super.toModel(),
            headers: this.headers
        }
    }
}

export class Base64Resource extends Resource {
    constructor(content: string) {
        super("base64", content)
    }
}
/**
 * Resources belong to assets dir.
 */
export class AssetsResource extends Resource {
    constructor(content: string) {
        super("doric_assets", content)
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
    constructor(name: string) {
        super("drawable", name)
    }
}

export class RawResource extends AndroidResource {
    constructor(name: string) {
        super("raw", name)
    }
}

export class AndroidAssetsResource extends AndroidResource {
    constructor(path: string) {
        super("android_assets", path)
    }
}

/**
 * This is for iOS platform
 */
export class MainBundleResource extends iOSResource {
    constructor(fileName: string) {
        super("mainBundle", fileName)
    }
}

export class BundleResource extends iOSResource {
    constructor(bundleName: string, fileName: string) {
        super("bundle", `${bundleName}://${fileName}`)
    }
}

export class ArrayBufferResource extends Resource {
    data: ArrayBuffer;

    constructor(data: ArrayBuffer) {
        super("arrayBuffer", uniqueId("buffer"));
        this.data = data;
    }

    toModel() {
        const ret = super.toModel();
        (ret as any).data = this.data;
        return ret;
    }
}
