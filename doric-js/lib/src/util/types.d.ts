export interface Modeling {
    toModel(): Model;
}
export declare function obj2Model(obj: Model, convertor: (v: Function) => string): Model;
type _M = string | number | boolean | Modeling | {
    [index: string]: Model;
} | undefined;
export type Model = _M | Array<_M>;
export type Binder<T> = (v: T) => void;
export declare class Mutable<T> {
    private val;
    private binders;
    get: () => T;
    set: (v: T) => void;
    private constructor();
    bind(binder: Binder<T>): void;
    static of<E>(v: E): Mutable<E>;
}
export type ClassType<T> = new (...args: any) => T;
export {};
