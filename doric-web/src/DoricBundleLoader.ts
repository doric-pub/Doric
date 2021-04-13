import axios from "axios"

export interface DoricJSLoader {
    filter(source: string): boolean;
    request(source: string): Promise<string>;
}


const loaders: DoricJSLoader[] = [
    {
        filter: () => true,
        request: async (source) => {
            const result = await axios.get(source)
            return result.data;
        }
    }
];

export function registerDoricJSLoader(loader: DoricJSLoader) {
    loaders.push(loader);
}

export async function loadDoricJSBundle(source: string): Promise<string> {
    const matched = loaders.filter(e => e.filter(source))
    if (matched.length > 0) {
        return matched[matched.length - 1].request(source)
    }
    throw new Error(`Cannot find matched loader for '${source}'`);

}