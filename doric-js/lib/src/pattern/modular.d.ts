import { Panel } from "../ui/panel";
import { Group } from "../ui/view";
export declare abstract class ModularPanel extends Panel {
    private modules;
    constructor(modules: Panel[]);
    abstract setupModules(): Panel[];
    abstract setupShelf(root: Group): Group;
    build(root: Group): void;
    onCreate(): void;
    onDestroy(): void;
    onShow(): void;
    onHidden(): void;
    onRenderFinished(): void;
}
