import { View } from "./view";
import { } from '../runtime/global'

export function Registor<T extends { new(...args: any[]): {} }>(constructor: T) {
    const ret = class extends constructor {
        context = context
    }
    context.registor(new ret)
    return ret
}


export abstract class Page {
    onCreate(): void { }
    onDestory(): void { }
    onShow(): void { }
    onHidden(): void { }

    abstract build(): View


    /**
     * Native Call
     */
    private __onCreate__(): void {
        this.onCreate()
    }

    private __onDestory__(): void {
        this.onDestory()
    }

    private __onShow__(): void {
        this.onShow()
    }

    private __onHidden__(): void {
        this.onHidden()
    }

    private __build__(): View {
        return this.build()
    }
}