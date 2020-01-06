import { Superview, View, IView, NativeViewModel } from '../ui/view';
export declare function scroller(content: View, config?: IScroller): Scroller;
export interface IScroller extends IView {
    content?: View;
}
export declare class Scroller extends Superview implements IScroller {
    content: View;
    allSubviews(): View[];
    toModel(): NativeViewModel;
}
