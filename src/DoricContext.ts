import { DoricPlugin } from "./DoricPlugin"

const doricContexts: Map<string, DoricContext> = new Map

export function getDoricContext(contextId: string) {
    return doricContexts.get(contextId)
}

export class DoricContext {
    contextId: string
    pluginInstances: Map<string, DoricPlugin> = new Map
    constructor(contextId: string) {
        this.contextId = contextId
        doricContexts.set(contextId, this)
    }
}