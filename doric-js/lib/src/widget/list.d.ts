import { View, Superview, NativeViewModel } from "../ui/view";
import { Stack } from "./layouts";
import { BridgeContext } from "../runtime/global";
import { Color } from "../util/color";
export declare class ListItem extends Stack {
    /**
     * Set to reuse native view
     */
    identifier?: string;
    actions?: {
        title: string;
        backgroundColor?: Color;
        callback: () => void;
    }[];
}
export declare class List extends Superview {
    private cachedViews;
    allSubviews(): ListItem[];
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
    scrolledPosition?: number;
    scrollable?: boolean;
    /**
     * Take effect only on iOS
     */
    bounces?: boolean;
    /**
     * Take effect only on iOS
     */
    scrollsToTop?: boolean;
    canDrag?: boolean;
    /**
     * @param from
     * @returns Returns the item of index which can dragged or not.
     */
    itemCanDrag?: (from: number) => boolean;
    /**
     * @param from
     * @returns Returns an array of index which can not be swap during dragging.
     */
    beforeDragging?: (from: number) => (Array<number> | void);
    onDragging?: (from: number, to: number) => void;
    onDragged?: (from: number, to: number) => void;
    preloadItemCount?: number;
    /**
     * @param {number} config.topOffset - 目标位置cell的顶部偏移量
     */
    scrollToItem(context: BridgeContext, index: number, config?: {
        animated?: boolean;
        topOffset?: number;
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
export declare function list(config: Partial<List>): List;
export declare function listItem(item: View | View[], config?: Partial<ListItem>): ListItem;
