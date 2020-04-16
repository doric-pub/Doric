import { View, Superview, NativeViewModel } from "../ui/view";
import { Stack } from "./layouts";
export declare class ListItem extends Stack {
    /**
     * Set to reuse native view
     */
    identifier?: string;
}
export declare class List extends Superview {
    private cachedViews;
    private ignoreDirtyCallOnce;
    allSubviews(): IterableIterator<ListItem> | ListItem[];
    itemCount: number;
    renderItem: (index: number) => ListItem;
    batchCount: number;
    onLoadMore?: () => void;
    loadMore?: boolean;
    loadMoreView?: ListItem;
    onScroll?: (offset: {
        x: number;
        y: number;
    }) => void;
    onScrollEnd?: (offset: {
        x: number;
        y: number;
    }) => void;
    reset(): void;
    private getItem;
    isDirty(): boolean;
    private renderBunchedItems;
    toModel(): NativeViewModel;
}
export declare function list(config: Partial<List>): List;
export declare function listItem(item: View | View[], config?: Partial<ListItem>): ListItem;
