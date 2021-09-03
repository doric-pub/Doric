import { View, Property, Superview, NativeViewModel } from "../ui/view";
import { List } from "./list";
import { Scroller } from "./scroller";
import { BridgeContext } from "../runtime/global";
import { layoutConfig } from "../util/layoutconfig";

export class Refreshable extends Superview implements JSX.ElementChildrenAttribute {

    content!: View

    header?: View

    @Property
    onRefresh?: () => void

    allSubviews() {
        const ret: View[] = [this.content]
        if (this.header) {
            ret.push(this.header)
        }
        return ret
    }

    setRefreshable(context: BridgeContext, refreshable: boolean) {
        return this.nativeChannel(context, 'setRefreshable')(refreshable)
    }

    setRefreshing(context: BridgeContext, refreshing: boolean) {
        return this.nativeChannel(context, 'setRefreshing')(refreshing)
    }

    isRefreshable(context: BridgeContext) {
        return this.nativeChannel(context, 'isRefreshable')() as Promise<boolean>
    }

    isRefreshing(context: BridgeContext) {
        return this.nativeChannel(context, 'isRefreshing')() as Promise<boolean>
    }

    toModel(): NativeViewModel {
        this.dirtyProps.content = this.content.viewId
        this.dirtyProps.header = ((this.header || {}) as any).viewId
        return super.toModel()
    }

    set innerElement(e: View | [View, View]) {
        if (e instanceof View) {
            this.content = e
        } else {
            this.header = e[0]
            this.content = e[1]
        }
    }
}

export function refreshable(config: Partial<Refreshable>) {
    const ret = new Refreshable
    ret.layoutConfig = layoutConfig().fit()
    ret.apply(config)
    return ret
}

export interface IPullable {
    startAnimation(): void
    stopAnimation(): void
    setPullingDistance(distance: number): void
}


export function pullable(v: View, config: IPullable) {
    Reflect.set(v, 'startAnimation', config.startAnimation)
    Reflect.set(v, 'stopAnimation', config.stopAnimation)
    Reflect.set(v, 'setPullingDistance', config.setPullingDistance)
    return v
}