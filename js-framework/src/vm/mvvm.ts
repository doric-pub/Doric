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
import { View, Group } from "../ui/view";
import { Panel } from "../ui/panel";

function listen<T extends Object>(obj: T, listener: Function): T {
    return new Proxy(obj, {
        get: (target, prop, receiver) => {
            const ret = Reflect.get(target, prop, receiver)
            if (ret instanceof Function) {
                return Reflect.get(target, prop, receiver)
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