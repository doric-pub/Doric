import { Superview, View, IView } from "../ui/view";
import { Stack } from "./layouts";
import { BridgeContext } from "../runtime/global";
export declare class SlideItem extends Stack {
    /**
     * Set to reuse native view
     */
    identifier?: string;
}
export interface ISlider extends IView {
    renderPage: (index: number) => SlideItem;
    itemCount: number;
    batchCount?: number;
    onPageSlided?: (index: number) => void;
}
export declare class Slider extends Superview implements ISlider {
    private cachedViews;
    private ignoreDirtyCallOnce;
    allSubviews(): IterableIterator<SlideItem>;
    itemCount: number;
    renderPage: (index: number) => SlideItem;
    batchCount: number;
    onPageSlided?: (index: number) => void;
    private getItem;
    isDirty(): boolean;
    private renderBunchedItems;
    slidePage(context: BridgeContext, page: number, smooth?: boolean): Promise<any>;
    getSlidedPage(context: BridgeContext): Promise<number>;
}
export declare function slideItem(item: View): SlideItem;
export declare function slider(config: ISlider): Slider;
