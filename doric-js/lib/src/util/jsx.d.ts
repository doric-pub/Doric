import { Group, View } from "../ui/view";
import { ClassType } from "./types";
export declare namespace jsx {
    function createElement<T extends View>(constructor: ClassType<T>, config: Partial<T> | null, ...children: any[]): any;
    class Fragment extends Group {
    }
}
declare global {
    namespace JSX {
        interface Element extends View {
        }
        interface ElementClass extends View {
        }
        interface ElementAttributesProperty {
            props: {};
        }
        interface ElementChildrenAttribute {
            innerElement: any;
        }
        interface IntrinsicElements {
        }
    }
}
