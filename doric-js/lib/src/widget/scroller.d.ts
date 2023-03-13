import { Superview, View, NativeViewModel } from '../ui/view';
import { BridgeContext } from '../runtime/global';
export declare function scroller(content: View, config?: Partial<Scroller>): Scroller;
export declare class Scroller extends Superview implements JSX.ElementChildrenAttribute {
    content: View;
    contentOffset?: {
        x: number;
        y: number;
    };
    onScroll?: (offset: {
        x: number;
        y: number;
    }) => void;
    onScrollEnd?: (offset: {
        x: number;
        y: number;
    }) => void;
    scrollable?: boolean;
    /**
     * Take effect only on iOS
     */
    bounces?: boolean;
    /**
     * Take effect only on iOS
     */
    scrollsToTop?: boolean;
    allSubviews(): View[];
    toModel(): NativeViewModel;
    scrollTo(context: BridgeContext, offset: {
        x: number;
        y: number;
    }, animated?: boolean): Promise<any>;
    scrollBy(context: BridgeContext, offset: {
        x: number;
        y: number;
    }, animated?: boolean): Promise<any>;
    set innerElement(e: View);
}
