import { Superview, View, IView } from '../ui/view';
export declare function scroller(content: View): Scroller;
export interface IScroller extends IView {
    content: View;
}
export declare class Scroller extends Superview implements IScroller {
    content: View;
    allSubviews(): View[];
    toModel(): {
        id: string;
        type: string;
        props: {
            [index: string]: import("../..").Model;
        };
    };
}
