import { uniqueId } from "../util/uniqueId";
import { loge } from "../util/log";

/**
 * ``` TypeScript
 * // load script in global scope
 * Reflect.apply(
 * function(hego,context,require){
 *  //Script content
 *  REG()
 * },hego.jsObtainContext(id),[
 * undefined,
 * hego.jsObtainContext(id),
 * hego.__require__,
 * ])
 * // load module in global scope
 * Reflect.apply(hego.jsRegisterModule,this,[
 *  moduleName,
 *  Reflect.apply(function(__module){
 *           (function(module,exports,require){
 *                      //module content
 *                  })(__module,__module.exports,hego.__require__);
 *           return __module.exports
 *      },this,[{exports:{}}])
 * ])
 * 
 * ```
 */

declare function nativeRequire(moduleName: string): boolean

declare function nativeBridge(contextId: string, namespace: string, method: string, callbackId?: string, args?: any): boolean

export function jsCallResolve(contextId: string, callbackId: string, args?: any) {
    const context = gContexts.get(contextId)
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`)
        return
    }
    const callback = context.callbacks.get(callbackId)
    if (callback === undefined) {
        loge(`Cannot find call for context id:${contextId},callback id:${callbackId}`)
        return
    }
    const argumentsList: any = []
    for (let i = 2; i < arguments.length; i++) {
        argumentsList.push(arguments[i])
    }
    Reflect.apply(callback.resolve, context, args)
}

export function jsCallReject(contextId: string, callbackId: string, args?: any) {
    const context = gContexts.get(contextId)
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`)
        return
    }
    const callback = context.callbacks.get(callbackId)
    if (callback === undefined) {
        loge(`Cannot find call for context id:${contextId},callback id:${callbackId}`)
        return
    }
    const argumentsList: any = []
    for (let i = 2; i < arguments.length; i++) {
        argumentsList.push(arguments[i])
    }
    Reflect.apply(callback.reject, context, args)
}

export class Context {
    entity: any
    id: string
    callbacks: Map<string, { resolve: Function, reject: Function }> = new Map
    constructor(id: string) {
        this.id = id
    }
    callNative(namespace: string, method: string, args?: any): Promise<any> {
        const callbackId = uniqueId('callback')

        nativeBridge(this.id, namespace, method, callbackId, args)
        return new Promise((resolve, reject) => {
            this.callbacks.set(callbackId, {
                resolve,
                reject,
            })
        })
    }
    register(instance: Object) {
        this.entity = instance
    }
}


const gContexts: Map<string, Context> = new Map
const gModules: Map<string, any> = new Map

export function jsObtainContext(id: string) {
    if (gContexts.has(id)) {
        return gContexts.get(id)
    } else {
        const context: Context = new Context(id)
        gContexts.set(id, context)
        return context
    }
}

export function jsReleaseContext(id: string) {
    gContexts.delete(id)
}

export function __require__(name: string): any {
    if (gModules.has(name)) {
        return gModules.get(name)
    } else {
        if (nativeRequire(name)) {
            return gModules.get(name)
        } else {
            return undefined
        }
    }
}

export function jsRegisterModule(name: string, moduleObject: any) {
    gModules.set(name, moduleObject)
}

export function jsCallEntityMethod(contextId: string, methodName: string, args?: any) {
    const context = gContexts.get(contextId)
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`)
        return
    }
    if (context.entity === undefined) {
        loge(`Cannot find holder for context id:${contextId}`)
        return
    }
    if (Reflect.has(context.entity, methodName)) {
        const argumentsList: any = []
        for (let i = 2; i < arguments.length; i++) {
            argumentsList.push(arguments[i])
        }
        return Reflect.apply(Reflect.get(context.entity, methodName), context.entity, argumentsList)
    } else {
        loge(`Cannot find method for context id:${contextId},method name is:${methodName}`)
    }
}

const global = Function('return this')()
let __timerId__ = 0
const timerCallbacks: Map<number, () => void> = new Map

declare function nativeSetTimer(timerId: number, interval: number, repeat: boolean): void
declare function nativeClearTimer(timerId: number): void

global.setTimeout = (handler: Function, timeout?: number | undefined, ...args: any[]) => {
    const id = __timerId__++
    timerCallbacks.set(id, () => {
        Reflect.apply(handler, undefined, args)
        timerCallbacks.delete(id)
    })
    nativeSetTimer(id, timeout || 0, false)
    return id
}
global.setInterval = (handler: Function, timeout?: number | undefined, ...args: any[]) => {
    const id = __timerId__++
    timerCallbacks.set(id, () => {
        Reflect.apply(handler, undefined, args)
    })
    nativeSetTimer(id, timeout || 0, true)
    return id
}

global.clearTimeout = (timerId: number) => {
    timerCallbacks.delete(timerId)
    nativeClearTimer(timerId)
}

global.clearInterval = (timerId: number) => {
    timerCallbacks.delete(timerId)
    nativeClearTimer(timerId)
}

export function jsCallbackTimer(timerId: number) {
    const timerCallback = timerCallbacks.get(timerId)
    if (timerCallback instanceof Function) {
        Reflect.apply(timerCallback, undefined, [])
    }
}