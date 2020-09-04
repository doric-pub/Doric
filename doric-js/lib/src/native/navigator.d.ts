import { BridgeContext } from "../runtime/global";
import { ClassType } from "../pattern/mvvm";
import { Panel } from "../ui/panel";
export declare function navigator(context: BridgeContext): {
    push: (source: string | ClassType<Panel>, config?: {
        alias?: string | undefined;
        animated?: boolean | undefined;
        extra?: object | undefined;
        singlePage?: boolean | undefined;
    } | undefined) => Promise<any>;
    pop: (animated?: boolean) => Promise<any>;
    openUrl: (url: string) => Promise<any>;
};
