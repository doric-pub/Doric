import { jsObtainContext, jsCallEntityMethod } from 'doric/src/runtime/sandbox'
import { Panel } from 'doric'
import { DoricPlugin } from "./DoricPlugin"
import { createContext, destroyContext } from "./DoricDriver"
import { DoricStackNode } from './shader/DoricStackNode'
import { DoricViewNode } from './shader/DoricViewNode'
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
    headNodes: Map<string, Map<string, DoricViewNode>> = new Map

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
        return Reflect.apply(jsCallEntityMethod, this.panel, argumentsList)
    }

    init(extra?: object) {
        this.invokeEntityMethod("__init__", extra ? JSON.stringify(extra) : undefined)
    }
    build(frame: {
        width: number,
        height: number,
    }) {
        this.invokeEntityMethod("__build__", frame)
    }
    teardown() {
        for (let plugin of this.pluginInstances.values()) {
            plugin.onTearDown()
        }
        destroyContext(this.contextId)
    }
}