import { DoricContext } from "./DoricContext"

export type DoricPluginClass = { new(...args: any[]): {} }
export class DoricPlugin {
    context: DoricContext
    constructor(context: DoricContext) {
        this.context = context
    }
    onTearDown() {

    }
}