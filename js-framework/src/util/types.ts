export interface Modeling {
    toModel(): Model
}
export function obj2Model(obj: Model): Model {
    if (obj instanceof Array) {
        return obj.map(e => obj2Model(e)) as Model
    } else if (obj instanceof Object) {
        if (Reflect.has(obj, 'toModel') && Reflect.get(obj, 'toModel') instanceof Function) {
            obj = Reflect.apply(Reflect.get(obj, 'toModel'), obj, [])
            return obj
        } else {
            for (let key in obj) {
                const val = Reflect.get(obj, key)
                Reflect.set(obj, key, obj2Model(val))
            }
            return obj
        }
    } else {
        return obj
    }
}

type _M = string | number | boolean | Modeling | { [index: string]: Model | undefined }
export type Model = _M | Array<_M>

export type Binder<T> = (v: T) => void

export class Mutable<T>{
    private val: T

    private binders: Set<Binder<T>> = new Set

    get = () => {
        return this.val
    }

    set = (v: T) => {
        this.val = v
        this.binders.forEach(e => {
            Reflect.apply(e, undefined, [this.val])
        })
    }

    private constructor(v: T) {
        this.val = v
    }

    bind(binder: Binder<T>) {
        this.binders.add(binder)
        Reflect.apply(binder, undefined, [this.val])
    }

    static of<E>(v: E) {
        return new Mutable(v)
    }
}