import { Superview, View, IView, NativeViewModel } from '../ui/view';
import { BridgeContext } from '../runtime/global';
export declare function scroller(content: View, config?: IScroller): Scroller;
export interface IScroller extends IView {
    content?: View;
}
export declare class Scroller extends Superview implements IScroller {
    content: View;
    allSubviews(): View[];
    toModel(): NativeViewModel;
    scrollTo(context: BridgeContext, offset: {
        x: number;
        y: number;
    }, animated?: boolean): Promise<any>;
}
