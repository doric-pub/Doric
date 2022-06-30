import { BridgeContext } from "../runtime/global";
import { Panel } from "../ui/panel";
import { ClassType } from "../util/types";
export declare function internalScheme(context: BridgeContext, panelClass: ClassType<Panel>): string;
export declare function navigator(context: BridgeContext): {
    push: (source: string | ClassType<Panel>, config?: {
        alias?: string;
        animated?: boolean;
        extra?: object;
        singlePage?: boolean;
    }) => Promise<any>;
    pop: (animated?: boolean) => Promise<any>;
    popSelf: (animated?: boolean) => Promise<any>;
    popToRoot: (animated?: boolean) => Promise<any>;
    openUrl: (url: string) => Promise<any>;
};
