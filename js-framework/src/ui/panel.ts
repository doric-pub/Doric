import { View } from "./view";
import { } from '../runtime/global'

export function Registor<T extends { new(...args: any[]): {} }>(constructor: T) {
    const ret = class extends constructor {
        context = context
    }
    context.register(new ret)
    return ret
}


export abstract class Panel {
    onCreate() { }
    onDestory() { }
    onShow() { }
    onHidden() { }

    abstract build(): View


    /**
     * Native Call
     */
    private __onCreate__() {
        Reflect.defineMetadata(Symbol.for("context"), context, Reflect.getPrototypeOf(context))
        this.onCreate()
    }

    private __onDestory__() {
        this.onDestory()
    }

    private __onShow__() {
        this.onShow()
    }

    private __onHidden__(): void {
        this.onHidden()
    }

    private __build__(): View {
        return this.build()
    }

    private __responedCallback__(viewId: string, callbackId: string) {

    }
}