import { Stack } from './layouts';
import { Superview, View, NativeViewModel } from '../ui/view';
export declare class FlowLayoutItem extends Stack {
    /**
    * Set to reuse native view
    */
    identifier?: string;
}
export declare class FlowLayout extends Superview {
    private cachedViews;
    allSubviews(): IterableIterator<FlowLayoutItem> | FlowLayoutItem[];
    columnCount: number;
    columnSpace?: number;
    rowSpace?: number;
    itemCount: number;
    renderItem: (index: number) => FlowLayoutItem;
    batchCount: number;
    onLoadMore?: () => void;
    loadMore?: boolean;
    loadMoreView?: FlowLayoutItem;
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
    private renderBunchedItems;
    toModel(): NativeViewModel;
}
export declare function flowlayout(config: Partial<FlowLayout>): FlowLayout;
export declare function flowItem(item: View | View[], config?: Partial<FlowLayoutItem>): FlowLayoutItem;
