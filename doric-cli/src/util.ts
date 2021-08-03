import globLib, { IOptions } from "glob";

export async function delay(timeout: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('');
        }, timeout);
    });
}

export function getAssetsDir() {
    return `${__dirname}/../assets`;
}
export function getLibAssetsDir() {
    return `${__dirname}/../assets-lib`;
}
export async function glob(pattern: string, options?: IOptions) {
    return new Promise((resolve, reject) => {
        if (options) {
            globLib(pattern, options, (err, ret) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(ret);
                }
            });
        } else {
            globLib(pattern, (err, ret) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(ret);
                }
            });
        }
    }) as Promise<string[]>;
}