import { Stack } from './layouts';
import { IView, Superview, View } from '../ui/view';
export declare class FlowLayoutItem extends Stack {
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
    toModel(): {
        id: string;
        type: string;
        props: {
            [index: string]: import("../util/types").Model;
        };
    };
}
export declare function flowlayout(config: IFlowLayout): FlowLayout;
export declare function flowItem(item: View): FlowLayoutItem;
