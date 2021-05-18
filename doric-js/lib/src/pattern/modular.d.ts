import { Panel } from "../ui/panel";
import { Group } from "../ui/view";
import { ClassType } from "../util/types";
import { ViewHolder, ViewModel } from "./mvvm";
import { Provider } from "./provider";
export declare abstract class Module extends Panel {
    superPanel?: ModularPanel;
    __provider?: Provider;
    get provider(): Provider | undefined;
    set provider(provider: Provider | undefined);
    private unmounted;
    mount(): void;
    unmount(): void;
    get mounted(): boolean;
    /**
     * Dispatch message to other modules.
     * @param message which is sent out
     */
    dispatchMessage(message: any): void;
    /**
     * Dispatched messages can be received by override this method.
     * @param message recevied message
     */
    onMessage(message: any): void;
    /**
     * Called when this module is mounted
     */
    onMounted(): void;
    /**
     * Called when this module is unmounted
     */
    onUnmounted(): void;
}
export declare abstract class VMModule<M extends Object, V extends ViewHolder> extends Module {
    private vm?;
    private vh?;
    abstract getViewModelClass(): ClassType<ViewModel<M, V>>;
    abstract getState(): M;
    abstract getViewHolderClass(): ClassType<V>;
    getViewModel(): ViewModel<M, V> | undefined;
    build(root: Group): void;
}
export declare abstract class ModularPanel extends Module {
    private modules;
    private scheduledRebuild?;
    constructor();
    /**
     * @returns Class list of current submodules
     */
    abstract setupModules(): ClassType<Panel>[];
    /**
     * @param root Current module's rootview
     * @returns provided for submodules as their rootview
     */
    abstract setupShelf(root: Group): Group;
    dispatchMessage(message: any): void;
    get mountedModules(): Panel[];
    onMessage(message: any): void;
    onStructureChanged(module: Module, mounted: boolean): void;
    build(root: Group): void;
    onCreate(): void;
    onDestroy(): void;
    onShow(): void;
    onHidden(): void;
    onRenderFinished(): void;
}
