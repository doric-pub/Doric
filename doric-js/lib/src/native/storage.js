export function storage(context) {
    return {
        setItem: (key, value, zone) => {
            return context.callNative('storage', 'setItem', { key, value, zone });
        },
        getItem: (key, zone) => {
            return context.callNative('storage', 'getItem', { key, zone });
        },
        remove: (key, zone) => {
            return context.callNative('storage', 'remove', { key, zone });
        },
        clear: (zone) => {
            return context.callNative('storage', 'clear', { zone });
        },
    };
}
