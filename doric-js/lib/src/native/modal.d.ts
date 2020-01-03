import { BridgeContext } from "../runtime/global";
import { Gravity } from "../util/gravity";
export declare function modal(context: BridgeContext): {
    toast: (msg: string, gravity?: Gravity) => void;
    alert: (arg: string | {
        title: string;
        msg: string;
        okLabel?: string | undefined;
    }) => Promise<any>;
    confirm: (arg: string | {
        title: string;
        msg: string;
        okLabel?: string | undefined;
        cancelLabel?: string | undefined;
    }) => Promise<any>;
    prompt: (arg: {
        title?: string | undefined;
        msg?: string | undefined;
        okLabel?: string | undefined;
        cancelLabel?: string | undefined;
        text?: string | undefined;
        defaultText?: string | undefined;
    }) => Promise<string>;
};
