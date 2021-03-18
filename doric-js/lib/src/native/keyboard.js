export function keyboard(context) {
    return {
        subscribe: (callback) => {
            return context.callNative('keyboard', 'subscribe', context.function2Id(callback));
        },
        unsubscribe: (subscribeId) => {
            context.removeFuncById(subscribeId);
            return context.callNative('keyboard', 'unsubscribe', subscribeId);
        }
    };
}
