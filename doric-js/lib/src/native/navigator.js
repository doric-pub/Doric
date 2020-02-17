export function navigator(context) {
    return {
        push: (source, config) => {
            if (config && config.extra) {
                config.extra = JSON.stringify(config.extra);
            }
            return context.callNative('navigator', 'push', {
                source, config
            });
        },
        pop: (animated = true) => {
            return context.callNative('navigator', 'pop', { animated });
        },
    };
}
