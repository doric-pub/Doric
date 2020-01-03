import { Group } from "../ui/view";
import { Panel } from "../ui/panel";
export declare abstract class ViewHolder {
    abstract build(root: Group): void;
}
export declare type Setter<M> = (state: M) => void;
export declare abstract class ViewModel<M extends Object, V extends ViewHolder> {
    private state;
    private viewHolder;
    constructor(obj: M, v: V);
    getState(): M;
    updateState(setter: Setter<M>): void;
    attach(view: Group): void;
    abstract onAttached(state: M, vh: V): void;
    abstract onBind(state: M, vh: V): void;
}
export declare type ViewModelClass<M, V extends ViewHolder> = new (m: M, v: V) => ViewModel<M, V>;
export declare type ViewHolderClass<V> = new () => V;
export declare abstract class VMPanel<M extends Object, V extends ViewHolder> extends Panel {
    private vm?;
    private vh?;
    abstract getViewModelClass(): ViewModelClass<M, V>;
    abstract getState(): M;
    abstract getViewHolderClass(): ViewHolderClass<V>;
    getViewModel(): ViewModel<M, V> | undefined;
    build(root: Group): void;
}
