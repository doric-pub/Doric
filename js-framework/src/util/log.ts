declare function nativeLog(type: 'd' | 'w' | 'e', message: string): void

function toString(message: any) {
    if (message instanceof Function) {
        return message.toString()
    } else if (message instanceof Object) {
        try {
            return JSON.stringify(message)
        } catch (e) {
            return message.toString()
        }
    } else if (message === undefined) {
        return "undefined"
    } else {
        return message.toString()
    }
}

export function log(message: any) {
    nativeLog('d', toString(message))
}

export function loge(message: any) {
    nativeLog('e', toString(message))
}

export function logw(message: any) {
    nativeLog('w', toString(message))
}
