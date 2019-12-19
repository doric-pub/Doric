import { jsObtainContext } from 'doric/src/runtime/sandbox'
import { acquireJSBundle, acquirePlugin } from './DoricRegistry'

let scriptId = 0
function getScriptId() {
    return `script_${scriptId++}`
}


let contexId = 0
export function getContextId() {
    return `context_${contexId++}`
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
    injectGlobalObject('nativeBridge', (contextId: string, namespace: string, method: string, callbackId?: string, args?: any) => {
        const context = jsObtainContext(contextId)
        const pluginClass = acquirePlugin(namespace)

        return true
    })

}

initDoric()