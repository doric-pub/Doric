/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export type Observer<T> = (v: T) => void
export type Updater<T> = (v: T) => T

export interface IObservable<T> {

    addObserver(observer: Observer<T | undefined>): void

    removeObserver(observer: Observer<T | undefined>): void

    update(updater: Updater<T | undefined>): void
}

export class Observable<M> implements IObservable<M>{
    private provider: IProvider

    private clz: { new(...args: any[]): M }

    private observers: Set<Observer<M | undefined>> = new Set
    constructor(provider: IProvider, clz: { new(...args: any[]): M }) {
        this.provider = provider
        this.clz = clz
    }

    addObserver(observer: Observer<M | undefined>): void {
        this.observers.add(observer)
    }

    removeObserver(observer: Observer<M | undefined>): void {
        this.observers.delete(observer)
    }

    update(updater: Updater<M | undefined>): void {
        const oldV = this.provider.acquire(this.clz)
        const newV = updater(oldV)
        if (newV !== undefined) {
            this.provider.provide(newV)
        }
        for (let observer of this.observers) {
            observer(newV)
        }
    }
}


export interface IProvider {
    provide(obj: Object): void
    acquire<T>(clz: { new(...args: any[]): T }): T | undefined
    remove<T>(clz: { new(...args: any[]): T }): void
    clear(): void
    observe<T>(clz: { new(...args: any[]): T }): Observable<T>
}

export class Provider implements IProvider {

    private provision: Map<Function, Object> = new Map
    private observableMap: Map<Function, Observable<any>> = new Map

    provide(obj: Object) {
        this.provision.set(obj.constructor, obj)
    }

    acquire<T>(clz: { new(...args: any[]): T }): T | undefined {
        const ret = this.provision.get(clz)
        return ret as T | undefined
    }

    remove<T>(clz: new (...args: any[]) => T): void {
        this.provision.delete(clz)
    }

    clear(): void {
        this.provision.clear()
    }

    observe<T>(clz: new (...args: any[]) => T): Observable<T> {
        let observable = this.observableMap.get(clz)
        if (observable === undefined) {
            observable = new Observable(this, clz)
            this.observableMap.set(clz, observable)
        }
        return observable
    }
}

