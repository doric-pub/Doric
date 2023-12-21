import { Superview, View } from "../ui/view";
import { Stack } from "./layouts";
import { BridgeContext } from "../runtime/global";
export declare class SlideItem extends Stack {
    /**
     * Set to reuse native view
     */
    identifier?: string;
}
export declare class Slider extends Superview {
    private cachedViews;
    allSubviews(): IterableIterator<SlideItem>;
    itemCount: number;
    renderPage: (index: number) => SlideItem;
    batchCount: number;
    onPageSlided?: (index: number) => void;
    loop?: boolean;
    scrollable?: boolean;
    /**
     * Take effect only on iOS
     */
    bounces?: boolean;
    /**
    * Take effect only on iOS
    */
    scrollsToTop?: boolean;
    /**
     * Set the effect when sliding
     * ZoomOut is currently supported
     */
    slideStyle?: "zoomOut" | {
        type: "zoomOut";
        minScale: number;
        maxScale: number;
    } | {
        type: "gallery";
        itemWidth: number;
        minScale: number;
        minAlpha: number;
    };
    slidePosition?: number;
    onScrollStart?: (offset: {
        x: number;
        y: number;
    }) => void;
    onScroll?: (offset: {
        x: number;
        y: number;
    }) => void;
    /**
     * Reload all list items.
     * @param context
     * @returns
     */
    reload(context: BridgeContext): Promise<void>;
    reset(): void;
    private getItem;
    private renderBunchedItems;
    slidePage(context: BridgeContext, page: number, smooth?: boolean): Promise<any>;
    getSlidedPage(context: BridgeContext): Promise<number>;
    scrollBy(context: BridgeContext, dx: number, config?: {
        animated?: boolean;
    }): Promise<void>;
}
export declare function slider(config: Partial<Slider>): Slider;
export declare function slideItem(item: View | View[], config?: Partial<SlideItem>): SlideItem;
