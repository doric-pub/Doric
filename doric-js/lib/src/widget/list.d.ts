import { View, Superview, IView, NativeViewModel } from "../ui/view";
import { Stack, IStack } from "./layouts";
export interface IListItem extends IStack {
    identifier?: string;
}
export declare class ListItem extends Stack implements IListItem {
    /**
     * Set to reuse native view
     */
    identifier?: string;
}
export interface IList extends IView {
    renderItem: (index: number) => ListItem;
    itemCount: number;
    batchCount?: number;
    onLoadMore?: () => void;
    loadMore?: boolean;
    loadMoreView?: ListItem;
}
export declare class List extends Superview implements IList {
    private cachedViews;
    private ignoreDirtyCallOnce;
    allSubviews(): IterableIterator<ListItem> | ListItem[];
    itemCount: number;
    renderItem: (index: number) => ListItem;
    batchCount: number;
    onLoadMore?: () => void;
    loadMore?: boolean;
    loadMoreView?: ListItem;
    reset(): void;
    private getItem;
    isDirty(): boolean;
    private renderBunchedItems;
    toModel(): NativeViewModel;
}
export declare function list(config: IList): List;
export declare function listItem(item: View | View[], config?: IListItem): ListItem;
