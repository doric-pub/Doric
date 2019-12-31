import { DoricPlugin } from "../DoricPlugin";

export class StoragePlugin extends DoricPlugin {
    setItem(args: {
        zone?: string,
        key: string,
        value: string
    }) {
        localStorage.setItem(`${args.zone}_${args.key}`, args.value)
        return Promise.resolve()
    }
    getItem(args: {
        zone?: string,
        key: string,
    }) {
        return Promise.resolve(localStorage.getItem(`${args.zone}_${args.key}`))
    }

    remove(args: {
        zone?: string,
        key: string,
    }) {
        localStorage.removeItem(`${args.zone}_${args.key}`)
        return Promise.resolve()
    }
    clear(args: {
        zone: string,
    }) {
        let removingKeys = []
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith(`${args.zone}_`)) {
                removingKeys.push(key)
            }
        }
        removingKeys.forEach(e => {
            localStorage.removeItem(e)
        })
        return Promise.resolve()
    }
}