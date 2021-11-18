export function resourceLoader(context) {
    return {
        load: (resource) => {
            return context.callNative('resourceLoader', 'load', resource.toModel());
        },
    };
}
