import { View, IView, Group } from '../ui/view';
import { BridgeContext } from '../runtime/global';
export declare function flexScroller(views: View[], config?: IFlexScroller): FlexScroller;
export interface IFlexScroller extends IView {
    contentOffset?: {
        x: number;
        y: number;
    };
}
export declare class FlexScroller extends Group implements IFlexScroller {
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
    scrollTo(context: BridgeContext, offset: {
        x: number;
        y: number;
    }, animated?: boolean): Promise<any>;
    scrollBy(context: BridgeContext, offset: {
        x: number;
        y: number;
    }, animated?: boolean): Promise<any>;
}
