import { Panel } from "../ui/panel";
export class ModularPanel extends Panel {
    constructor(modules) {
        super();
        this.modules = [];
        this.modules = modules;
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
