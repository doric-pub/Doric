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

export function log(...args: any) {
    let out = ""
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ','
        }
        out += toString(arguments[i])
    }
    nativeLog('d', out)
}

export function loge(...message: any) {
    let out = ""
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ','
        }
        out += toString(arguments[i])
    }
    nativeLog('e', out)
}

export function logw(...message: any) {
    let out = ""
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ','
        }
        out += toString(arguments[i])
    }
    nativeLog('w', out)
}
