import { uniqueId } from "../util/uniqueId";

/**
 * ``` TypeScript
 * // load script in global scope
 * Reflect.apply(
 * function(hego,context,require){
 *  //Script content
 *  REG()
 * },hego.obtainContext(id),[
 * undefined,
 * hego.obtainContext(id),
 * hego.__require__,
 * ])
 * // load module in global scope
 * Reflect.apply(hego.registerModule,this,[
 *  moduleName,
 *  Reflect.apply(function(__module){
 *          return function(module,export,require){
 *                  })(__module,__module.exports,hego.__require__)
 *      },this,[{exports:{}}])
 * ])
 * 
 * ```
 */
declare function nativeRequire(moduleName: string): boolean

declare function nativeBridge(contextId: string, namespace: string, method: string, args?: any, callbackId?: string): boolean


export function log(message: any) {
    console.log(message)
}

export function loge(message: any) {
    console.error(message)
}

export function logw(message: any) {
    console.warn(message)
}

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
    id: string
    callbacks: Map<string, { resolve: Function, reject: Function }> = new Map
    constructor(id: string) {
        this.id = id
    }
    callNative(namespace: string, method: string, args?: any): Promise<any> {
        const callbackId = uniqueId('callback')

        nativeBridge(this.id, namespace, method, args, callbackId)
        return new Promise((resolve, reject) => {
            this.callbacks.set(callbackId, {
                resolve,
                reject,
            })
        })
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

export function jsCallContextMethod(contextId: string, methodName: string, args?: any) {
    const context = gContexts.get(contextId)
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`)
        return
    }
    if (Reflect.has(context, methodName)) {
        const argumentsList: any = []
        for (let i = 2; i < arguments.length; i++) {
            argumentsList.push(arguments[i])
        }
        return Reflect.apply(Reflect.get(context, methodName), context, argumentsList)
    } else {
        loge(`Cannot find method for context id:${contextId},method name is:${methodName}`)
    }
}

