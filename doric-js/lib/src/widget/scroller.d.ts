import { Superview, View, NativeViewModel } from '../ui/view';
import { BridgeContext } from '../runtime/global';
export declare function scroller(content: View, config?: Partial<Scroller>): Scroller;
export declare class Scroller extends Superview {
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
}
