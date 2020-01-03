export function navigator(context) {
    return {
        push: (scheme, config) => {
            if (config && config.extra) {
                config.extra = JSON.stringify(config.extra);
            }
            return context.navigator.push({
                scheme, config
            });
        },
        pop: (animated = true) => {
            return context.navigator.pop({ animated });
        },
    };
}
