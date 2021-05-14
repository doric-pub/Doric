import { Panel } from "../ui/panel";
export class Module extends Panel {
    get provider() {
        var _a;
        return this.__provider || ((_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.provider);
    }
    set provider(provider) {
        this.__provider = provider;
    }
    dispatchMessage(message) {
        var _a;
        (_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.dispatchMessage(message);
    }
    onMessage(message) { }
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
    onMessage(message) {
        this.modules.forEach(e => {
            if (e instanceof Module) {
                e.onMessage(message);
            }
        });
    }
    build(root) {
        const groupView = this.setupShelf(root);
        this.modules.forEach(e => {
            Reflect.set(e, "__root__", groupView);
            e.build(groupView);
        });
    }
    onCreate() {
        super.onCreate();
        this.modules.forEach(e => {
            e.context = this.context;
            e.onCreate();
        });
    }
    onDestroy() {
        super.onDestroy();
        this.modules.forEach(e => {
            e.onDestroy();
        });
    }
    onShow() {
        super.onShow();
        this.modules.forEach(e => {
            e.onShow();
        });
    }
    onHidden() {
        super.onHidden();
        this.modules.forEach(e => {
            e.onHidden();
        });
    }
    onRenderFinished() {
        super.onRenderFinished();
        this.modules.forEach(e => {
            e.onRenderFinished();
        });
    }
}
