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
import { Group } from "../ui/view";
import { Panel } from "../ui/panel";

export abstract class ViewHolder<M>{
    abstract build(root: Group): void
    abstract bind(state: M): void
}

export type Setter<M> = (state: M) => void

export abstract class ViewModel<M extends Object, V extends ViewHolder<M>> {
    private state: M
    private viewHolder: V

    constructor(obj: M, v: V) {
        this.state = obj
        this.viewHolder = v
    }

    getState() {
        return this.state
    }

    updateState(setter: Setter<M>) {
        setter(this.state)
        this.viewHolder.bind(this.state)
    }

    attach(view: Group) {
        this.viewHolder.build(view)
    }
}
export type ViewModelClass<M> = new (m: M, v: ViewHolder<M>) => ViewModel<M, ViewHolder<M>>

export type ViewHolderClass<M> = new () => ViewHolder<M>

export abstract class VMPanel<M extends Object> extends Panel {

    private vm?: ViewModel<M, ViewHolder<M>>
    private vh?: ViewHolder<M>

    abstract getViewModelClass(): ViewModelClass<M>

    abstract getState(): M

    abstract getViewHolderClass(): ViewHolderClass<M>

    getViewModel() {
        return this.vm
    }

    build(root: Group): void {
        this.vh = new (this.getViewHolderClass())
        this.vm = new (this.getViewModelClass())(this.getState(), this.vh)
        this.vm.attach(root)
    }
}

