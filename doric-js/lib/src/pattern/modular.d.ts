import { Panel } from "../ui/panel";
import { Group } from "../ui/view";
import { ClassType } from "../util/types";
export declare abstract class Module extends Panel {
    superPanel?: ModularPanel;
    dispatchMessage(message: any): void;
    onMessage(message: any): void;
}
export declare abstract class ModularPanel extends Module {
    private modules;
    constructor();
    abstract setupModules(): ClassType<Panel>[];
    abstract setupShelf(root: Group): Group;
    dispatchMessage(message: any): void;
    onMessage(message: any): void;
    build(root: Group): void;
    onCreate(): void;
    onDestroy(): void;
    onShow(): void;
    onHidden(): void;
    onRenderFinished(): void;
}
