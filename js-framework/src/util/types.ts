export interface Modeling {
    toModel(): Model
}
export function obj2Model(obj: Model): Model {
    if (obj instanceof Array) {
        return obj.map(e => obj2Model(e)) as Model
    } else if (obj instanceof Object
        && Reflect.has(obj, 'toModel')
        && Reflect.get(obj, 'toModel') instanceof Function) {
        obj = Reflect.apply(Reflect.get(obj, 'toModel'), obj, [])
        return obj
    } else {
        return obj
    }
}

type _M = string | number | boolean | Modeling | { [index: string]: Model | undefined }
export type Model = _M | Array<_M>