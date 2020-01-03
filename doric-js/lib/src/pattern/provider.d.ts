export declare type Observer<T> = (v: T) => void;
export declare type Updater<T> = (v: T) => T;
export interface IObservable<T> {
    addObserver(observer: Observer<T | undefined>): void;
    removeObserver(observer: Observer<T | undefined>): void;
    update(updater: Updater<T | undefined>): void;
}
export declare class Observable<M> implements IObservable<M> {
    private provider;
    private clz;
    private observers;
    constructor(provider: IProvider, clz: {
        new (...args: any[]): M;
    });
    addObserver(observer: Observer<M | undefined>): void;
    removeObserver(observer: Observer<M | undefined>): void;
    update(updater: Updater<M | undefined>): void;
}
export interface IProvider {
    provide(obj: Object): void;
    acquire<T>(clz: {
        new (...args: any[]): T;
    }): T | undefined;
    remove<T>(clz: {
        new (...args: any[]): T;
    }): void;
    clear(): void;
    observe<T>(clz: {
        new (...args: any[]): T;
    }): Observable<T>;
}
export declare class Provider implements IProvider {
    private provision;
    private observableMap;
    provide(obj: Object): void;
    acquire<T>(clz: {
        new (...args: any[]): T;
    }): T | undefined;
    remove<T>(clz: new (...args: any[]) => T): void;
    clear(): void;
    observe<T>(clz: new (...args: any[]) => T): Observable<T>;
}
