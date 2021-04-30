import { jsCallResolve } from "doric/src/runtime/sandbox";
import { DoricPlugin } from "../DoricPlugin";

namespace NotificationCenter {
    type Notification = {
        name: string,
        data?: object
    }
    export type Receiver = {
        name: string,
        callback: (data?: object) => void
    }
    let receivers: Receiver[] = []

    export function publish(notification: Notification) {
        receivers.filter(e => e.name === notification.name).forEach(e => {
            e.callback(notification.data)
        })
    }

    export function subscribe(receiver: Receiver) {
        receivers.push(receiver)
    }

    export function unsubscribe(receiver: Receiver) {
        receivers = receivers.filter(e => e !== receiver)
    }
}


export class NotificationPlugin extends DoricPlugin {
    private receivers: Record<string, NotificationCenter.Receiver | undefined> = {}

    publish(args: {
        biz?: string,
        name: string,
        data?: string,
    }) {
        const key = `__doric__${args.biz || ""}#${args.name}`
        NotificationCenter.publish({
            name: key,
            data: !!args.data ? JSON.parse(args.data) : undefined
        })
        return true
    }
    subscribe(args: {
        biz?: string,
        name: string,
        callback: string,
    }) {
        const key = `__doric__${args.biz || ""}#${args.name}`
        const receiver = {
            name: key,
            callback: (data?: object) => {
                jsCallResolve(this.context.contextId, args.callback, data)
            }
        }
        this.receivers[args.callback] = receiver
        NotificationCenter.subscribe(receiver)
        return args.callback
    }

    unsubscribe(subscribeId: string) {
        const recevier = this.receivers[subscribeId]
        if (recevier) {
            NotificationCenter.unsubscribe(recevier)
            this.receivers[subscribeId] = undefined
            return true
        } else {
            return false
        }
    }

    onTearDown() {
        Object.entries(this.receivers).map(e => e[1]).filter(e => !!e).forEach(e => {
            if (e) {
                NotificationCenter.unsubscribe(e)
            }
        })
        this.receivers = {}
    }

}
