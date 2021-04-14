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
import "reflect-metadata";
function hookBeforeNativeCall(context) {
    if (context) {
        Reflect.defineMetadata('__doric_context__', context, global);
        context.hookBeforeNativeCall();
    }
}
function hookAfterNativeCall(context) {
    if (context) {
        context.hookAfterNativeCall();
    }
}
function getContext() {
    return Reflect.getMetadata('__doric_context__', global);
}
function setContext(context) {
    Reflect.defineMetadata('__doric_context__', context, global);
}
export function jsCallResolve(contextId, callbackId, args) {
    const context = gContexts.get(contextId);
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`);
        return;
    }
    const callback = context.callbacks.get(callbackId);
    if (callback === undefined) {
        loge(`Cannot find call for context id:${contextId},callback id:${callbackId}`);
        return;
    }
    const argumentsList = [];
    for (let i = 2; i < arguments.length; i++) {
        argumentsList.push(arguments[i]);
    }
    hookBeforeNativeCall(context);
    Reflect.apply(callback.resolve, context, argumentsList);
    hookAfterNativeCall(context);
}
export function jsCallReject(contextId, callbackId, args) {
    const context = gContexts.get(contextId);
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`);
        return;
    }
    const callback = context.callbacks.get(callbackId);
    if (callback === undefined) {
        loge(`Cannot find call for context id:${contextId},callback id:${callbackId}`);
        return;
    }
    const argumentsList = [];
    for (let i = 2; i < arguments.length; i++) {
        argumentsList.push(arguments[i]);
    }
    hookBeforeNativeCall(context);
    Reflect.apply(callback.reject, context.entity, argumentsList);
    hookAfterNativeCall(context);
}
export class Context {
    constructor(id) {
        this.callbacks = new Map;
        this.classes = new Map;
        this.id = id;
        return new Proxy(this, {
            get: (target, p) => {
                if (Reflect.has(target, p)) {
                    return Reflect.get(target, p);
                }
                else {
                    const namespace = p;
                    return new Proxy({}, {
                        get: (target, p) => {
                            if (Reflect.has(target, p)) {
                                return Reflect.get(target, p);
                            }
                            else {
                                const context = this;
                                return function () {
                                    const args = [];
                                    args.push(namespace);
                                    args.push(p);
                                    for (let arg of arguments) {
                                        args.push(arg);
                                    }
                                    return Reflect.apply(context.callNative, context, args);
                                };
                            }
                        }
                    });
                }
            }
        });
    }
    hookBeforeNativeCall() {
        if (this.entity && Reflect.has(this.entity, 'hookBeforeNativeCall')) {
            Reflect.apply(Reflect.get(this.entity, 'hookBeforeNativeCall'), this.entity, []);
        }
    }
    hookAfterNativeCall() {
        if (this.entity && Reflect.has(this.entity, 'hookAfterNativeCall')) {
            Reflect.apply(Reflect.get(this.entity, 'hookAfterNativeCall'), this.entity, []);
        }
    }
    callNative(namespace, method, args) {
        const callbackId = uniqueId('callback');
        nativeBridge(this.id, namespace, method, callbackId, args);
        return new Promise((resolve, reject) => {
            this.callbacks.set(callbackId, {
                resolve,
                reject,
            });
        });
    }
    register(instance) {
        this.entity = instance;
    }
    function2Id(func) {
        const functionId = uniqueId('function');
        this.callbacks.set(functionId, {
            resolve: func,
            reject: () => { loge("This should not be called"); }
        });
        return functionId;
    }
    removeFuncById(funcId) {
        this.callbacks.delete(funcId);
    }
}
const gContexts = new Map;
const gModules = new Map;
export function allContexts() {
    return gContexts.values();
}
export function jsObtainContext(id) {
    if (gContexts.has(id)) {
        const context = gContexts.get(id);
        setContext(context);
        return context;
    }
    else {
        const context = new Context(id);
        gContexts.set(id, context);
        setContext(context);
        return context;
    }
}
export function jsReleaseContext(id) {
    const context = gContexts.get(id);
    const args = arguments;
    if (context) {
        timerInfos.forEach((v, k) => {
            if (v.context === context) {
                if (global.nativeClearTimer === undefined) {
                    return Reflect.apply(_clearTimeout, undefined, args);
                }
                timerInfos.delete(k);
                nativeClearTimer(k);
            }
        });
    }
    gContexts.delete(id);
}
export function __require__(name) {
    if (gModules.has(name)) {
        return gModules.get(name);
    }
    else {
        if (nativeRequire(name)) {
            return gModules.get(name);
        }
        else {
            return undefined;
        }
    }
}
export function jsRegisterModule(name, moduleObject) {
    gModules.set(name, moduleObject);
}
export function jsCallEntityMethod(contextId, methodName, args) {
    const context = gContexts.get(contextId);
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`);
        return;
    }
    if (context.entity === undefined) {
        loge(`Cannot find holder for context id:${contextId}`);
        return;
    }
    if (Reflect.has(context.entity, methodName)) {
        const argumentsList = [];
        for (let i = 2; i < arguments.length; i++) {
            argumentsList.push(arguments[i]);
        }
        hookBeforeNativeCall(context);
        const ret = Reflect.apply(Reflect.get(context.entity, methodName), context.entity, argumentsList);
        hookAfterNativeCall(context);
        return ret;
    }
    else {
        loge(`Cannot find method for context id:${contextId},method name is:${methodName}`);
    }
}
export function pureCallEntityMethod(contextId, methodName, args) {
    const context = gContexts.get(contextId);
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`);
        return;
    }
    if (context.entity === undefined) {
        loge(`Cannot find holder for context id:${contextId}`);
        return;
    }
    if (Reflect.has(context.entity, methodName)) {
        const argumentsList = [];
        for (let i = 2; i < arguments.length; i++) {
            argumentsList.push(arguments[i]);
        }
        return Reflect.apply(Reflect.get(context.entity, methodName), context.entity, argumentsList);
    }
    else {
        loge(`Cannot find method for context id:${contextId},method name is:${methodName}`);
    }
}
export function jsObtainEntry(contextId) {
    const context = jsObtainContext(contextId);
    const exportFunc = (constructor) => {
        context === null || context === void 0 ? void 0 : context.classes.set(constructor.name, constructor);
        const ret = new constructor;
        Reflect.set(ret, 'context', context);
        context === null || context === void 0 ? void 0 : context.register(ret);
        return constructor;
    };
    return function () {
        if (arguments.length === 1) {
            const args = arguments[0];
            if (args instanceof Array) {
                args.forEach(clz => {
                    context === null || context === void 0 ? void 0 : context.classes.set(clz.name, clz);
                });
                return exportFunc;
            }
            else {
                return exportFunc(args);
            }
        }
        else if (arguments.length === 2) {
            const srcContextId = arguments[0];
            const className = arguments[1];
            const srcContext = gContexts.get(srcContextId);
            if (srcContext) {
                const clz = srcContext.classes.get(className);
                if (clz) {
                    return exportFunc(clz);
                }
                else {
                    throw new Error(`Cannot find class:${className} in context:${srcContextId}`);
                }
            }
            else {
                throw new Error(`Cannot find context for ${srcContextId}`);
            }
        }
        else {
            throw new Error(`Entry arguments error:${arguments}`);
        }
    };
}
const global = Function('return this')();
let __timerId__ = 1;
const timerInfos = new Map;
const _setTimeout = global.setTimeout;
const _setInterval = global.setInterval;
const _clearTimeout = global.clearTimeout;
const _clearInterval = global.clearInterval;
const doricSetTimeout = function (handler, timeout, ...args) {
    if (global.nativeSetTimer === undefined) {
        return Reflect.apply(_setTimeout, undefined, arguments);
    }
    const id = __timerId__++;
    timerInfos.set(id, {
        callback: () => {
            Reflect.apply(handler, undefined, args);
            timerInfos.delete(id);
        },
        context: getContext(),
    });
    nativeSetTimer(id, timeout || 0, false);
    return id;
};
const doricSetInterval = function (handler, timeout, ...args) {
    if (global.nativeSetTimer === undefined) {
        return Reflect.apply(_setInterval, undefined, arguments);
    }
    const id = __timerId__++;
    timerInfos.set(id, {
        callback: () => {
            Reflect.apply(handler, undefined, args);
        },
        context: getContext(),
    });
    nativeSetTimer(id, timeout || 0, true);
    return id;
};
const doricClearTimeout = function (timerId) {
    if (global.nativeClearTimer === undefined) {
        return Reflect.apply(_clearTimeout, undefined, arguments);
    }
    timerInfos.delete(timerId);
    nativeClearTimer(timerId);
};
const doricClearInterval = function (timerId) {
    if (global.nativeClearTimer === undefined) {
        return Reflect.apply(_clearInterval, undefined, arguments);
    }
    timerInfos.delete(timerId);
    nativeClearTimer(timerId);
};
if (!global.setTimeout) {
    global.setTimeout = doricSetTimeout;
}
else {
    global.doricSetTimeout = doricSetTimeout;
}
if (!global.setInterval) {
    global.setInterval = doricSetInterval;
}
else {
    global.doricSetInterval = doricSetInterval;
}
if (!global.clearTimeout) {
    global.clearTimeout = doricClearTimeout;
}
else {
    global.doricClearTimeout = doricClearTimeout;
}
if (!global.clearInterval) {
    global.clearInterval = doricClearInterval;
}
else {
    global.doricClearInterval = doricClearInterval;
}
export function jsCallbackTimer(timerId) {
    const timerInfo = timerInfos.get(timerId);
    if (timerInfo === undefined) {
        return;
    }
    if (timerInfo.callback instanceof Function) {
        hookBeforeNativeCall(timerInfo.context);
        Reflect.apply(timerInfo.callback, timerInfo.context, []);
        hookAfterNativeCall(timerInfo.context);
    }
}
