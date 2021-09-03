import { View, Superview, NativeViewModel } from "../ui/view";
import { BridgeContext } from "../runtime/global";
export declare class Refreshable extends Superview implements JSX.ElementChildrenAttribute {
    content: View;
    header?: View;
    onRefresh?: () => void;
    allSubviews(): View[];
    setRefreshable(context: BridgeContext, refreshable: boolean): Promise<any>;
    setRefreshing(context: BridgeContext, refreshing: boolean): Promise<any>;
    isRefreshable(context: BridgeContext): Promise<boolean>;
    isRefreshing(context: BridgeContext): Promise<boolean>;
    toModel(): NativeViewModel;
    set innerElement(e: View | [View, View]);
}
export declare function refreshable(config: Partial<Refreshable>): Refreshable;
export interface IPullable {
    startAnimation(): void;
    stopAnimation(): void;
    setPullingDistance(distance: number): void;
}
export declare function pullable(v: View, config: IPullable): View;
