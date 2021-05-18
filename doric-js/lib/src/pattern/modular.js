import { Panel } from "../ui/panel";
export class Module extends Panel {
    constructor() {
        super(...arguments);
        this.unmounted = false;
    }
    get provider() {
        var _a;
        return this.__provider || ((_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.provider);
    }
    set provider(provider) {
        this.__provider = provider;
    }
    mount() {
        var _a;
        if (this.unmounted) {
            this.unmounted = false;
            (_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.onStructureChanged(this, true);
            this.onMounted();
        }
    }
    unmount() {
        var _a;
        if (!this.unmounted) {
            this.unmounted = true;
            (_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.onStructureChanged(this, false);
            this.onUnmounted();
        }
    }
    get mounted() {
        return !this.unmounted;
    }
    /**
     * Dispatch message to other modules.
     * @param message which is sent out
     */
    dispatchMessage(message) {
        var _a;
        (_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.dispatchMessage(message);
    }
    /**
     * Dispatched messages can be received by override this method.
     * @param message recevied message
     */
    onMessage(message) { }
    /**
     * Called when this module is mounted
     */
    onMounted() { }
    /**
     * Called when this module is unmounted
     */
    onUnmounted() { }
}
export class VMModule extends Module {
    getViewModel() {
        return this.vm;
    }
    build(root) {
        this.vh = new (this.getViewHolderClass());
        this.vm = new (this.getViewModelClass())(this.getState(), this.vh);
        this.vm.context = this.context;
        this.vm.attach(root);
    }
}
export class ModularPanel extends Module {
    constructor() {
        super();
        this.modules = this.setupModules().map(e => {
            const instance = new e;
            if (instance instanceof Module) {
                instance.superPanel = this;
            }
            return instance;
        });
    }
    dispatchMessage(message) {
        if (this.superPanel) {
            this.superPanel.dispatchMessage(message);
        }
        else {
            this.onMessage(message);
        }
    }
    get mountedModules() {
        return this.modules.filter(e => !(e instanceof Module) || e.mounted);
    }
    onMessage(message) {
        this.mountedModules.forEach(e => {
            if (e instanceof Module) {
                e.onMessage(message);
            }
        });
    }
    onStructureChanged(module, mounted) {
        if (this.superPanel) {
            this.superPanel.onStructureChanged(module, mounted);
        }
        else {
            if (!!!this.scheduledRebuild) {
                this.scheduledRebuild = setTimeout(() => {
                    this.scheduledRebuild = undefined;
                    this.getRootView().children.length = 0;
                    this.build(this.getRootView());
                }, 0);
            }
        }
    }
    build(root) {
        const groupView = this.setupShelf(root);
        this.mountedModules.forEach(e => {
            Reflect.set(e, "__root__", groupView);
            e.build(groupView);
        });
    }
    onCreate() {
        super.onCreate();
        this.mountedModules.forEach(e => {
            e.context = this.context;
            e.onCreate();
        });
    }
    onDestroy() {
        super.onDestroy();
        this.mountedModules.forEach(e => {
            e.onDestroy();
        });
    }
    onShow() {
        super.onShow();
        this.mountedModules.forEach(e => {
            e.onShow();
        });
    }
    onHidden() {
        super.onHidden();
        this.mountedModules.forEach(e => {
            e.onHidden();
        });
    }
    onRenderFinished() {
        super.onRenderFinished();
        this.mountedModules.forEach(e => {
            e.onRenderFinished();
        });
    }
}
