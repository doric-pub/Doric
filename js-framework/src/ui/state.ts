function from(obj: Object) {
    return new Proxy(obj, {
        set: (target, prop, value, receiver) => {
            return Reflect.set(target, prop, value, receiver)
        }
    })
}
class Wrapper {
    val: any
    constructor(val: any) {
        this.val = val
    }
    toVal(): any {
        return this.val
    }
}
export class State {
    static of<T extends Object>(obj: T): T {
        return new Proxy(obj, {
            get: (target, prop) => {
                const ret = Reflect.get(target, prop)
                if (ret instanceof Object) {
                    return State.of(ret)
                } else {
                    return new Wrapper(ret)
                }
            }
        })
    }
}