import { jsCallResolve, jsCallReject } from 'doric/src/runtime/sandbox'
import { acquireJSBundle, acquirePlugin } from './DoricRegistry'
import { getDoricContext } from './DoricContext'
import { DoricPlugin } from './DoricPlugin'

let __scriptId__ = 0
function getScriptId() {
    return `script_${__scriptId__++}`
}



export function injectGlobalObject(name: string, value: any) {
    Reflect.set(window, name, value, window)
}

export function loadJS(script: string) {
    const scriptElement = document.createElement('script')
    scriptElement.text = script
    scriptElement.id = getScriptId()
    document.body.appendChild(scriptElement)
}

function packageModuleScript(name: string, content: string) {
    return `Reflect.apply(doric.jsRegisterModule,this,[${name},Reflect.apply(function(__module){(function(module,exports,require){
${content}
})(__module,__module.exports,doric.__require__);
return __module.exports;},this,[{exports:{}}])])`
}

function packageCreateContext(contextId: string, content: string) {
    return `Reflect.apply(function(doric,context,Entry,require,exports){
${content}
},doric.jsObtainContext("${contextId}"),[undefined,doric.jsObtainContext("${contextId}"),doric.jsObtainEntry("${contextId}"),doric.__require__,{}])`
}

function initDoric() {
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
            loadJS(packageModuleScript(moduleName, packageModuleScript(name, bundle)))
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
                },
                e => {
                    jsCallReject(contextId, callbackId, e)
                })
        } else {
            jsCallResolve(contextId, callbackId, ret)
        }
        return true
    })

}
export function createContext(contextId: string, content: string) {
    loadJS(packageCreateContext(contextId, content))
}

initDoric()