export function notification(context) {
    return {
        /**
         * @param androidSystem: when set true, using global broadcast instead of local broadcast by default
         * @param iosUsingObject: when set true, using object instead of userInfo by default
         */
        publish: (args) => {
            if (args.data !== undefined) {
                args.data = JSON.stringify(args.data);
            }
            return context.callNative('notification', 'publish', args);
        },
        /**
         * @param androidSystem: when set true, using global broadcast instead of local broadcast by default
         * @param iosUsingObject: when set true, using object instead of userInfo by default
         */
        subscribe: (args) => {
            args.callback = context.function2Id(args.callback);
            return context.callNative('notification', 'subscribe', args);
        },
        unsubscribe: (subscribeId) => {
            context.removeFuncById(subscribeId);
            return context.callNative('notification', 'unsubscribe', subscribeId);
        }
    };
}
