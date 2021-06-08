export function internalScheme(context, panelClass) {
    return `_internal_://export?class=${encodeURIComponent(panelClass.name)}&context=${context.id}`;
}
export function navigator(context) {
    const moduleName = "navigator";
    return {
        push: (source, config) => {
            if (typeof source === 'function') {
                source = internalScheme(context, source);
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
        popSelf: (animated = true) => {
            return context.callNative(moduleName, 'popSelf', { animated });
        },
        popToRoot: (animated = true) => {
            return context.callNative(moduleName, 'popToRoot', { animated });
        },
        openUrl: (url) => {
            return context.callNative(moduleName, "openUrl", url);
        },
    };
}
