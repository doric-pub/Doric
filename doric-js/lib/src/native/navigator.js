export function navigator(context) {
    const moduleName = "navigator";
    return {
        push: (source, config) => {
            if (typeof source === 'function') {
                source = `_internal_://export?class=${encodeURIComponent(source.name)}&context=${context.id}`;
            }
            if (config && config.extra) {
                config.extra = JSON.stringify(config.extra);
            }
            return context.callNative(moduleName, 'push', {
                source, config
            });
        },
        pop: (animated = true) => {
            return context.callNative(moduleName, 'pop', { animated });
        },
        openUrl: (url) => {
            return context.callNative(moduleName, "openUrl", url);
        },
    };
}
