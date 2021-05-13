import { Panel } from "../ui/panel";
import { Group } from "../ui/view";
import { ClassType } from "../util/types";
export declare abstract class ModularPanel extends Panel {
    private modules;
    constructor();
    abstract setupModules(): ClassType<Panel>[];
    abstract setupShelf(root: Group): Group;
    build(root: Group): void;
    onCreate(): void;
    onDestroy(): void;
    onShow(): void;
    onHidden(): void;
    onRenderFinished(): void;
}
