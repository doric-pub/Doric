export interface IWatcher {
    onPropertyChanged(propKey: string, oldV: any, newV: any): void
}


export function Property(target: IWatcher, propKey: string) {
    const key = Symbol(propKey)
    Reflect.defineProperty(target, propKey, {
        configurable: false,
        enumerable: true,
        get: () => {
            return Reflect.get(target, key)
        },
        set: (v: any) => {
            const oldV = Reflect.get(target, key)
            Reflect.set(target, key, v)
            target.onPropertyChanged(propKey, oldV, v)
        }
    })
}
