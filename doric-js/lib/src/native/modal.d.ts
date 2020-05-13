import { BridgeContext } from "../runtime/global";
import { Gravity } from "../util/gravity";
export declare function modal(context: BridgeContext): {
    toast: (msg: string, gravity?: Gravity) => void;
    alert: (arg: string | {
        title: string;
        msg: string;
        okLabel?: string;
    }) => Promise<any>;
    confirm: (arg: string | {
        title: string;
        msg: string;
        okLabel?: string;
        cancelLabel?: string;
    }) => Promise<any>;
    prompt: (arg: {
        title?: string;
        msg?: string;
        okLabel?: string;
        cancelLabel?: string;
        text?: string;
        defaultText?: string;
    }) => Promise<string>;
};
