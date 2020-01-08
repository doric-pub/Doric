export function notification(context) {
    return {
        publish: (args) => {
            if (args.data !== undefined) {
                args.data = JSON.stringify(args.data);
            }
            return context.notification.publish(args);
        },
        subscribe: (args) => {
            args.callback = context.function2Id(args.callback);
            return context.notification.subscribe(args);
        },
        unsubscribe: (subscribeId) => {
            context.removeFuncById(subscribeId);
            return context.notification.unsubscribe({ subscribeId });
        }
    };
}
