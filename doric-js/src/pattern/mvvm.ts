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
import { Group } from "../ui/view"
import { Panel } from "../ui/panel"

export abstract class ViewHolder {
    abstract build(root: Group): void
}

export type Setter<M> = (state: M) => void

export abstract class ViewModel<M extends Object, V extends ViewHolder> {
    private state: M
    private viewHolder: V

    constructor(obj: M, v: V) {
        this.state = obj
        this.viewHolder = v
    }

    getState() {
        return this.state
    }

    getViewHolder() {
        return this.viewHolder;
    }

    updateState(setter: Setter<M>) {
        setter(this.state)
        this.onBind(this.state, this.viewHolder)
    }

    attach(view: Group) {
        this.viewHolder.build(view)
        this.onAttached(this.state, this.viewHolder)
        this.onBind(this.state, this.viewHolder)
    }

    abstract onAttached(state: M, vh: V): void

    abstract onBind(state: M, vh: V): void
}
export type ViewModelClass<M, V extends ViewHolder> = new (m: M, v: V) => ViewModel<M, V>

export type ViewHolderClass<V> = new () => V

export abstract class VMPanel<M extends Object, V extends ViewHolder> extends Panel {

    private vm?: ViewModel<M, V>
    private vh?: V

    abstract getViewModelClass(): ViewModelClass<M, V>

    abstract getState(): M

    abstract getViewHolderClass(): ViewHolderClass<V>

    getViewModel() {
        return this.vm
    }

    build(root: Group): void {
        this.vh = new (this.getViewHolderClass())
        this.vm = new (this.getViewModelClass())(this.getState(), this.vh)
        this.vm.attach(root)
    }
}

