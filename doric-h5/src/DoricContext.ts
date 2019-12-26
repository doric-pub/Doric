import { jsObtainContext, jsCallEntityMethod } from 'doric/src/runtime/sandbox'
import { Panel } from 'doric'
import { DoricPlugin } from "./DoricPlugin"
import { createContext, destroyContext } from "./DoricDriver"
import { DoricStackNode } from './shader/DoricStackNode'
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
    rootNode: DoricStackNode
    constructor(content: string) {
        createContext(this.contextId, content)
        doricContexts.set(this.contextId, this)
        this.rootNode = new DoricStackNode(this)
    }

    get panel() {
        return jsObtainContext(this.contextId)?.entity as Panel
    }

    invokeEntityMethod(method: string, ...otherArgs: any) {
        const argumentsList: any = [this.contextId]
        for (let i = 0; i < arguments.length; i++) {
            argumentsList.push(arguments[i])
        }
        Reflect.apply(jsCallEntityMethod, this.panel, argumentsList)
    }

    init(frame: {
        width: number,
        height: number,
    }, extra?: object) {
        this.invokeEntityMethod("__init__", frame, extra ? JSON.stringify(extra) : undefined)
    }

    teardown() {
        destroyContext(this.contextId)
    }
}