import { View, Superview, NativeViewModel } from "../ui/view";
import { Stack } from "./layouts";
import { BridgeContext } from "../runtime/global";
export declare class HorizontalListItem extends Stack {
    /**
     * Set to reuse native view
     */
    identifier?: string;
}
export declare class HorizontalList extends Superview {
    private cachedViews;
    allSubviews(): HorizontalListItem[];
    itemCount: number;
    renderItem: (index: number) => HorizontalListItem;
    batchCount: number;
    onLoadMore?: () => void;
    loadMore?: boolean;
    loadMoreView?: HorizontalListItem;
    onScroll?: (offset: {
        x: number;
        y: number;
    }) => void;
    onScrollEnd?: (offset: {
        x: number;
        y: number;
    }) => void;
    scrolledPosition?: number;
    scrollable?: boolean;
    /**
     * Take effect only on iOS
     */
    bounces?: boolean;
    canDrag?: boolean;
    beforeDragging?: (from: number) => void;
    onDragging?: (from: number, to: number) => void;
    onDragged?: (from: number, to: number) => void;
    scrollToItem(context: BridgeContext, index: number, config?: {
        animated?: boolean;
    }): Promise<any>;
    /**
     * @param context
     * @returns Returns array of visible view's index.
     */
    findVisibleItems(context: BridgeContext): Promise<number[]>;
    /**
     * @param context
     * @returns Returns array of completely visible view's index.
     */
    findCompletelyVisibleItems(context: BridgeContext): Promise<number[]>;
    /**
     * Reload all list items.
     * @param context
     * @returns
     */
    reload(context: BridgeContext): Promise<void>;
    reset(): void;
    private getItem;
    private renderBunchedItems;
    toModel(): NativeViewModel;
}
export declare function horizontalList(config: Partial<HorizontalList>): HorizontalList;
export declare function horizontalListItem(item: View | View[], config?: Partial<HorizontalListItem>): HorizontalListItem;
