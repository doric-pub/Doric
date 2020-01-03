function transformRequest(request) {
    let url = request.url || "";
    if (request.params !== undefined) {
        const queryStrings = [];
        for (let key in request.params) {
            queryStrings.push(`${key}=${encodeURIComponent(request.params[key])}`);
        }
        request.url = `${request.url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStrings.join('&')}`;
    }
    if (typeof request.data === 'object') {
        request.data = JSON.stringify(request.data);
    }
    return request;
}
export function network(context) {
    return {
        request: (config) => {
            return context.network.request(transformRequest(config));
        },
        get: (url, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "get";
            return context.network.request(transformRequest(finalConfig));
        },
        post: (url, data, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "post";
            if (data !== undefined) {
                finalConfig.data = data;
            }
            return context.network.request(transformRequest(finalConfig));
        },
        put: (url, data, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "put";
            if (data !== undefined) {
                finalConfig.data = data;
            }
            return context.network.request(transformRequest(finalConfig));
        },
        delete: (url, data, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "delete";
            return context.network.request(transformRequest(finalConfig));
        },
    };
}
