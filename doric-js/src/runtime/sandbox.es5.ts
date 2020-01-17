/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { uniqueId } from "../util/uniqueId";
import { loge } from "../util/log";
import "reflect-metadata"

/**
 * ``` TypeScript
 * // load script in global scope
 * Reflect.apply(
 * function(doric,context,Entry,require){
 *  //Script content
 *  REG()
 * },doric.jsObtainContext(id),[
 * undefined,
 * doric.jsObtainContext(id),
 * doric.jsObtainEntry(id),
 * doric.__require__,
 * ])
 * // load module in global scope
 * Reflect.apply(doric.jsRegisterModule,this,[
 *  moduleName,
 *  Reflect.apply(function(__module){
 *           (function(module,exports,require){
 *                      //module content
 *                  })(__module,__module.exports,doric.__require__);
 *           return __module.exports
 *      },this,[{exports:{}}])
 * ])
 * 
 * ```
 */

declare function nativeRequire(moduleName: string): boolean

declare function nativeBridge(contextId: string, namespace: string, method: string, callbackId?: string, args?: any): boolean

declare function nativeSetTimer(timerId: number, interval: number, repeat: boolean): void

declare function nativeClearTimer(timerId: number): void

function hookBeforeNativeCall(context?: Context) {
    if (context) {
        Reflect.defineMetadata('__doric_context__', context, global)
        context.hookBeforeNativeCall()
    }
}

function hookAfterNativeCall(context?: Context) {
    if (context) {
        context.hookAfterNativeCall()
    }
}

function getContext(): Context | undefined {
    return Reflect.getMetadata('__doric_context__', global)
}

function setContext(context?: Context) {
    Reflect.defineMetadata('__doric_context__', context, global)
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
    hookBeforeNativeCall(context)
    Reflect.apply(callback.resolve, context, argumentsList)
    hookAfterNativeCall(context)
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
    hookBeforeNativeCall(context)
    Reflect.apply(callback.reject, context.entity, argumentsList)
    hookAfterNativeCall(context)
}

export class Context {
    entity: any
    id: string
    callbacks: Map<string, { resolve: Function, reject: Function }> = new Map

    hookBeforeNativeCall() {
        if (this.entity && Reflect.has(this.entity, 'hookBeforeNativeCall')) {
            Reflect.apply(Reflect.get(this.entity, 'hookBeforeNativeCall'), this.entity, [])
        }
    }

    hookAfterNativeCall() {
        if (this.entity && Reflect.has(this.entity, 'hookAfterNativeCall')) {
            Reflect.apply(Reflect.get(this.entity, 'hookAfterNativeCall'), this.entity, [])
        }
    }

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

    function2Id(func: Function) {
        const functionId = uniqueId('function')
        this.callbacks.set(functionId, {
            resolve: func,
            reject: () => { loge("This should not be called") }
        })
        return functionId
    }
    removeFuncById(funcId: string) {
        this.callbacks.delete(funcId)
    }
}


const gContexts: Map<string, Context> = new Map
const gModules: Map<string, any> = new Map

export function jsObtainContext(id: string) {
    if (gContexts.has(id)) {
        const context = gContexts.get(id)
        setContext(context)
        return context
    } else {
        const context: Context = new Context(id)
        gContexts.set(id, context)
        setContext(context)
        return context
    }
}

export function jsReleaseContext(id: string) {
    const context = gContexts.get(id)
    const args = arguments
    if (context) {
        timerInfos.forEach((v, k) => {
            if (v.context === context) {
                if (global.nativeClearTimer === undefined) {
                    return Reflect.apply(_clearTimeout, undefined, args)
                }
                timerInfos.delete(k)
                nativeClearTimer(k)
            }
        })
    }
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
        hookBeforeNativeCall(context)
        const ret = Reflect.apply(Reflect.get(context.entity, methodName), context.entity, argumentsList)
        hookAfterNativeCall(context)
        return ret
    } else {
        loge(`Cannot find method for context id:${contextId},method name is:${methodName}`)
    }
}

export function jsObtainEntry(contextId: string) {
    const context = jsObtainContext(contextId)
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        const ret = class extends constructor {
            context = context
        }
        if (context) {
            context.register(new ret)
        }
        return ret
    }
}


const global = Function('return this')()
let __timerId__ = 0

const timerInfos: Map<number, { callback: () => void, context?: Context }> = new Map

const _setTimeout = global.setTimeout

const _setInterval = global.setInterval

const _clearTimeout = global.clearTimeout

const _clearInterval = global.clearInterval

const doricSetTimeout = function (handler: Function, timeout?: number | undefined, ...args: any[]) {
    if (global.nativeSetTimer === undefined) {
        return Reflect.apply(_setTimeout, undefined, arguments)
    }
    const id = __timerId__++
    timerInfos.set(id, {
        callback: () => {
            Reflect.apply(handler, undefined, args)
            timerInfos.delete(id)
        },
        context: getContext(),
    })
    nativeSetTimer(id, timeout || 0, false)
    return id
}
const doricSetInterval = function (handler: Function, timeout?: number | undefined, ...args: any[]) {
    if (global.nativeSetTimer === undefined) {
        return Reflect.apply(_setInterval, undefined, arguments)
    }
    const id = __timerId__++
    timerInfos.set(id, {
        callback: () => {
            Reflect.apply(handler, undefined, args)
        },
        context: getContext(),
    })
    nativeSetTimer(id, timeout || 0, true)
    return id
}

const doricClearTimeout = function (timerId: number) {
    if (global.nativeClearTimer === undefined) {
        return Reflect.apply(_clearTimeout, undefined, arguments)
    }
    timerInfos.delete(timerId)
    nativeClearTimer(timerId)
}

const doricClearInterval = function (timerId: number) {
    if (global.nativeClearTimer === undefined) {
        return Reflect.apply(_clearInterval, undefined, arguments)
    }
    timerInfos.delete(timerId)
    nativeClearTimer(timerId)
}

if (!global.setTimeout) {
    global.setTimeout = doricSetTimeout
} else {
    global.doricSetTimeout = doricSetTimeout
}

if (!global.setInterval) {
    global.setInterval = doricSetInterval
} else {
    global.doricSetInterval = doricSetInterval
}

if (!global.clearTimeout) {
    global.clearTimeout = doricClearTimeout
} else {
    global.doricClearTimeout = doricClearTimeout
}

if (!global.clearInterval) {
    global.clearInterval = doricClearInterval
} else {
    global.doricClearInterval = doricClearInterval
}

export function jsCallbackTimer(timerId: number) {
    const timerInfo = timerInfos.get(timerId)
    if (timerInfo === undefined) {
        return
    }
    if (timerInfo.callback instanceof Function) {
        hookBeforeNativeCall(timerInfo.context)
        Reflect.apply(timerInfo.callback, timerInfo.context, [])
        hookAfterNativeCall(timerInfo.context)
    }
}