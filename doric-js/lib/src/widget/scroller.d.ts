import { Superview, View, IView, NativeViewModel } from '../ui/view';
import { BridgeContext } from '../runtime/global';
export declare function scroller(content: View, config?: IScroller): Scroller;
export interface IScroller extends IView {
    content?: View;
    contentOffset?: {
        x: number;
        y: number;
    };
}
export declare class Scroller extends Superview implements IScroller {
    content: View;
    contentOffset?: {
        x: number;
        y: number;
    };
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
