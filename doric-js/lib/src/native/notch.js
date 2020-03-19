export function notch(context) {
    return {
        inset: () => {
            return context.callNative('notch', 'inset', {});
        }
    };
}
