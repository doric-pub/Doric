import { Stack, IStack } from './layouts';
import { IView, Superview, View, NativeViewModel } from '../ui/view';
export interface IFlowLayoutItem extends IStack {
    identifier?: string;
}
export declare class FlowLayoutItem extends Stack implements IFlowLayoutItem {
    /**
    * Set to reuse native view
    */
    identifier?: string;
}
export interface IFlowLayout extends IView {
    renderItem: (index: number) => FlowLayoutItem;
    itemCount: number;
    batchCount?: number;
    columnCount?: number;
    columnSpace?: number;
    rowSpace?: number;
    loadMore?: boolean;
    onLoadMore?: () => void;
    loadMoreView?: FlowLayoutItem;
}
export declare class FlowLayout extends Superview implements IFlowLayout {
    private cachedViews;
    private ignoreDirtyCallOnce;
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
    reset(): void;
    private getItem;
    isDirty(): boolean;
    private renderBunchedItems;
    toModel(): NativeViewModel;
}
export declare function flowlayout(config: IFlowLayout): FlowLayout;
export declare function flowItem(item: View | View[], config?: IFlowLayoutItem): FlowLayoutItem;
