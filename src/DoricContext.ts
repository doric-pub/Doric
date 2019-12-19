import { jsObtainContext } from 'doric/src/runtime/sandbox'
import { Panel } from 'doric'
import { DoricPlugin } from "./DoricPlugin"
import { createContext } from "./DoricDriver"
const doricContexts: Map<string, DoricContext> = new Map

let __contextId__ = 0
function getContextId() {
    return `context_${__contextId__++}`
}

export function getDoricContext(contextId: string) {
    return doricContexts.get(contextId)
}

export class DoricContext {
    contextId = getContextId()
    pluginInstances: Map<string, DoricPlugin> = new Map
    constructor(content: string) {
        createContext(this.contextId, content)
        doricContexts.set(this.contextId, this)
    }
    get context() {
        return jsObtainContext(this.contextId)
    }

    get panel() {
        return this.context?.entity as Panel
    }

    getEntityMethod(method: string) {
        return Reflect.get(this.panel, method, this.panel) as Function
    }

}