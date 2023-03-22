import { NativeViewModel } from "../ui/view";
export declare function deepClone(nativeViewModel: NativeViewModel): {
    id: string;
    type: string;
    props: {
        [x: string]: import("../..").Model;
    };
};
