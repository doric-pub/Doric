export class Observable {
    constructor(provider, clz) {
        this.observers = new Set;
        this.provider = provider;
        this.clz = clz;
    }
    addObserver(observer) {
        this.observers.add(observer);
    }
    removeObserver(observer) {
        this.observers.delete(observer);
    }
    update(updater) {
        const oldV = this.provider.acquire(this.clz);
        const newV = updater(oldV);
        if (newV !== undefined) {
            this.provider.provide(newV);
        }
        for (let observer of this.observers) {
            observer(newV);
        }
    }
}
export class Provider {
    constructor() {
        this.provision = new Map;
        this.observableMap = new Map;
    }
    provide(obj) {
        this.provision.set(obj.constructor, obj);
    }
    acquire(clz) {
        const ret = this.provision.get(clz);
        return ret;
    }
    remove(clz) {
        this.provision.delete(clz);
    }
    clear() {
        this.provision.clear();
    }
    observe(clz) {
        let observable = this.observableMap.get(clz);
        if (observable === undefined) {
            observable = new Observable(this, clz);
            this.observableMap.set(clz, observable);
        }
        return observable;
    }
}
