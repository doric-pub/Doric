export function storage(context) {
    return {
        setItem: (key, value, zone) => {
            return context.storage.setItem({ key, value, zone });
        },
        getItem: (key, zone) => {
            return context.storage.getItem({ key, zone });
        },
        remove: (key, zone) => {
            return context.storage.remove({ key, zone });
        },
        clear: (zone) => {
            return context.storage.clear({ zone });
        },
    };
}
