import { jsCallResolve, jsCallReject, jsCallbackTimer, jsReleaseContext, jsHookAfterNativeCall } from 'doric/src/runtime/sandbox'
import { acquireJSBundle, acquirePlugin } from './DoricRegistry'
import { getDoricContext } from './DoricContext'
import { DoricPlugin } from './DoricPlugin'

function getScriptId(contextId: string) {
    return `__doric_script_${contextId}`
}

const originSetTimeout = window.setTimeout
const originClearTimeout = window.clearTimeout
const originSetInterval = window.setInterval
const originClearInterval = window.clearInterval

const timers: Map<number, { handleId: number, repeat: boolean }> = new Map

export function injectGlobalObject(name: string, value: any) {
    Reflect.set(window, name, value, window)
}

export function loadJS(contextId: string, script: string) {
    const scriptElement = document.createElement('script')
    scriptElement.text = script
    scriptElement.id = getScriptId(contextId)
    document.body.appendChild(scriptElement)
}

function packageModuleScript(name: string, content: string) {
    return `Reflect.apply(doric.jsRegisterModule,this,["${name}",Reflect.apply(function(__module){(function(module,exports,require,setTimeout,setInterval,clearTimeout,clearInterval){
${content}
})(__module,__module.exports,doric.__require__,doricSetTimeout,doricSetInterval,doricClearTimeout,doricClearInterval);
return __module.exports;},this,[{exports:{}}])])`
}

function packageCreateContext(contextId: string, content: string) {
    return `//@ sourceURL=contextId_${contextId}.js
Reflect.apply(function(doric,context,Entry,require,exports,setTimeout,setInterval,clearTimeout,clearInterval){
${content}
},undefined,[undefined,doric.jsObtainContext("${contextId}"),doric.jsObtainEntry("${contextId}"),doric.__require__,{},doricSetTimeout,doricSetInterval,doricClearTimeout,doricClearInterval])`
}

function initDoric() {
    injectGlobalObject("Environment", {
        platform: "web"
    })

    injectGlobalObject('nativeLog', (type: 'd' | 'w' | 'e', message: string) => {
        switch (type) {
            case 'd':
                console.log(message)
                break
            case 'w':
                console.warn(message)
                break
            case 'e':
                console.error(message)
                break
        }
    })

    injectGlobalObject('nativeRequire', (moduleName: string) => {
        const bundle = acquireJSBundle(moduleName)
        if (bundle === undefined || bundle.length === 0) {
            console.log(`Cannot require JS Bundle :${moduleName}`)
            return false
        } else {
            loadJS(moduleName, packageModuleScript(moduleName, bundle))
            return true
        }
    })
    injectGlobalObject('nativeBridge', (contextId: string, namespace: string, method: string, callbackId: string, args?: any) => {
        const pluginClass = acquirePlugin(namespace)
        const doricContext = getDoricContext(contextId)
        if (pluginClass === undefined) {
            console.error(`Cannot find Plugin:${namespace}`)
            return false
        }
        if (doricContext === undefined) {
            console.error(`Cannot find Doric Context:${contextId}`)
            return false
        }
        let plugin = doricContext.pluginInstances.get(namespace)
        if (plugin === undefined) {
            plugin = new pluginClass(doricContext) as DoricPlugin
            doricContext.pluginInstances.set(namespace, plugin)
        }
        if (!Reflect.has(plugin, method)) {
            console.error(`Cannot find Method:${method} in plugin ${namespace}`)
            return false
        }
        const pluginMethod = Reflect.get(plugin, method, plugin)
        if (typeof pluginMethod !== 'function') {
            console.error(`Plugin ${namespace}'s property ${method}'s type is ${typeof pluginMethod} not function,`)
        }
        const ret = Reflect.apply(pluginMethod, plugin, [args])
        if (ret instanceof Promise) {
            ret.then(
                e => {
                    jsCallResolve(contextId, callbackId, e)
                    markNeedHook()
                },
                e => {
                    jsCallReject(contextId, callbackId, e)
                    markNeedHook()
                })
        } else if (ret !== undefined) {
            Promise.resolve(ret).then((ret) => {
                jsCallResolve(contextId, callbackId, ret)
                markNeedHook()
            })
        }
        return true
    })

    injectGlobalObject('nativeSetTimer', (timerId: number, time: number, repeat: boolean) => {
        if (repeat) {
            const handleId = originSetInterval(() => {
                jsCallbackTimer(timerId)
                markNeedHook()
            }, time)
            timers.set(timerId, { handleId, repeat })
        } else {
            const handleId = originSetTimeout(() => {
                jsCallbackTimer(timerId)
                markNeedHook()
            }, time)
            timers.set(timerId, { handleId, repeat })
        }
    })
    injectGlobalObject('nativeClearTimer', (timerId: number) => {
        const timerInfo = timers.get(timerId)
        if (timerInfo) {
            if (timerInfo.repeat) {
                originClearInterval(timerInfo.handleId)
            } else {
                originClearTimeout(timerInfo.handleId)
            }
        }
    })
}

export function createContext(contextId: string, content: string) {
    loadJS(contextId, packageCreateContext(contextId, content))
}
export function destroyContext(contextId: string) {
    jsReleaseContext(contextId)
    const scriptElement = document.getElementById(getScriptId(contextId))
    if (scriptElement) {
        document.body.removeChild(scriptElement)
    }
}

let requesting = false

export function markNeedHook() {
    if (requesting) {
        return
    }
    requesting = true
    requestAnimationFrame(() => {
        jsHookAfterNativeCall()
        requesting = false
    })
}
initDoric()