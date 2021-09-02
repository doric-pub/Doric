import { Group, View } from "../ui/view";
import { ClassType } from "./types";
export declare namespace jsx {
    function createElement<T extends View>(constructor: ClassType<T>, config: Partial<T> | null, ...children: View[]): T;
    class Fragment extends Group {
    }
}
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
