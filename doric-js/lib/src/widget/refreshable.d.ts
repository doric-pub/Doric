import { View, Superview, IView, NativeViewModel } from "../ui/view";
import { List } from "./list";
import { Scroller } from "./scroller";
import { BridgeContext } from "../runtime/global";
export interface IRefreshable extends IView {
    content: View;
    header?: View;
    onRefresh?: () => void;
}
export declare class Refreshable extends Superview implements IRefreshable {
    content: List | Scroller;
    header?: View;
    onRefresh?: () => void;
    allSubviews(): View[];
    setRefreshable(context: BridgeContext, refreshable: boolean): Promise<any>;
    setRefreshing(context: BridgeContext, refreshing: boolean): Promise<any>;
    isRefreshable(context: BridgeContext): Promise<boolean>;
    isRefreshing(context: BridgeContext): Promise<boolean>;
    toModel(): NativeViewModel;
}
export declare function refreshable(config: IRefreshable): Refreshable;
export interface IPullable {
    startAnimation(): void;
    stopAnimation(): void;
    setPullingDistance(distance: number): void;
}
export declare function pullable(v: View, config: IPullable): View;
