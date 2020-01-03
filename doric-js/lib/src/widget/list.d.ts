import { View, Superview, IView } from "../ui/view";
import { Stack } from "./layouts";
export declare class ListItem extends Stack {
    /**
     * Set to reuse native view
     */
    identifier?: string;
}
export interface IList extends IView {
    renderItem: (index: number) => ListItem;
    itemCount: number;
    batchCount?: number;
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
    toModel(): {
        id: string;
        type: string;
        props: {
            [index: string]: import("../..").Model;
        };
    };
}
export declare function list(config: IList): List;
export declare function listItem(item: View): ListItem;
