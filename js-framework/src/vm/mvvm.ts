import { View, Group } from "../ui/view";
import { Panel } from "../ui/panel";

function listen<T extends Object>(obj: T, listener: Function): T {
    return new Proxy(obj, {
        get: (target, prop, receiver) => {
            const ret = Reflect.get(target, prop, receiver)
            if (ret instanceof Function) {
                return () => {
                    return Reflect.apply(ret, receiver, arguments)
                }
            } else if (ret instanceof Object) {
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

export abstract class ViewHolder {
    abstract build(root: Group): void
}

export abstract class VMPanel<M extends Object, V extends ViewHolder> extends Panel {

    private vm?: ViewModel<M, V>

    abstract getVMClass(): new (m: M, v: V) => ViewModel<M, V>


    abstract getModel(): M

    abstract getViewHolder(): V

    getVM() {
        return this.vm
    }

    build(root: Group): void {
        this.vm = new (this.getVMClass())(this.getModel(), this.getViewHolder())
        this.vm.build(root)
    }
}

export abstract class ViewModel<M extends Object, V extends ViewHolder> {
    private model: M
    private listeners: Function[] = []
    private viewHolder: V

    constructor(obj: M, v: V) {
        this.model = listen(obj, () => {
            this.listeners.forEach(e => {
                Reflect.apply(e, this.model, [this.model])
            })
        })
        this.viewHolder = v
    }

    build(root: Group) {
        this.viewHolder.build(root)
        this.bind((data: M) => {
            this.binding(this.viewHolder, data)
        })
    }

    abstract binding(v: V, model: M): void

    getModel() {
        return this.model
    }

    bind(f: (data: M) => void) {
        Reflect.apply(f, this.model, [this.model])
        this.listeners.push(f)
    }
}