import { View, Group } from "../ui/view";
import { Panel } from "../ui/panel";


function listen<T extends Object>(obj: T, listener: Function): T {
    return new Proxy(obj, {
        get: (target, prop, receiver) => {
            const ret = Reflect.get(target, prop, receiver)
            if (ret instanceof Object) {
                return listen(ret, listener)
            } else {
                return ret
            }
        },

        set: (target, prop, value, receiver) => {
            const ret = Reflect.set(target, prop, value, receiver)
            Reflect.apply(listener, undefined, [])
            return ret
        },
    })
}

export abstract class VMPanel<M extends Object> extends Panel {

    private vm: ViewModel<M> = this.createVM()

    abstract createVM(): ViewModel<M>


    getModel() {
        return this.vm.getModel()
    }

    getVM() {
        return this.vm
    }

    build(root: Group): void {
        this.vm.build(root, this.vm.getModel())
    }
}

export abstract class ViewModel<M extends Object> {
    private model: M
    private listeners: Function[] = []
    constructor(obj: M) {
        this.model = listen(obj, () => {
            this.listeners.forEach(e => {
                Reflect.apply(e, this.model, [this.model])
            })
        })
    }

    abstract build(root: Group, model: M): void

    getModel() {
        return this.model
    }

    bind(f: (data: M) => void) {
        Reflect.apply(f, this.model, [this.model])
        this.listeners.push(f)
    }
}