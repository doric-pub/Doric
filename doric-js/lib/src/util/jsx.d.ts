import { View } from "../ui/view";
import { ClassType } from "./types";
export declare const jsx: {
    createElement: <T extends View>(constructor: ClassType<T>, config: Partial<T> | null, ...children: View[]) => T;
};
declare global {
    namespace JSX {
        interface IntrinsicElements {
        }
        interface ElementClass extends View {
        }
        interface ElementAttributesProperty {
            props: {};
        }
        interface ElementChildrenAttribute {
            children: View[];
        }
    }
}
