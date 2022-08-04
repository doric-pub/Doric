import { Group, View } from "../ui/view";
import { layoutConfig } from "./layoutconfig";
import { ClassType } from "./types";

export namespace jsx {
    export function createElement<T extends View>(
        constructor: ClassType<T>,
        config: Partial<T> | null,
        ...children: any[]
    ) {
        if (!!(constructor as any).isViewClass) {
            const e = new constructor();
            if (e instanceof Fragment) {
                return children
            }
            e.layoutConfig = e.layoutConfig ?? layoutConfig().fit()
            if (config) {
                e.apply(config)
            }
            if (children && children.length > 0) {
                if (children.length === 1) {
                    children = children[0]
                }
                if (Reflect.has(e, "innerElement")) {
                    Reflect.set(e, "innerElement", children, e)
                } else {
                    throw new Error(
                        `Do not support ${constructor.name} for ${children}`
                    );
                }
            }
            return e;
        } else {
            const f = constructor as Function
            const args = config ?? {}
            if (children && children.length > 0) {
                if (children.length === 1) {
                    children = children[0]
                }
                (args as any).innerElement = children
            }
            const e = Reflect.apply(f, undefined, [args])
            if (e instanceof Fragment) {
                return children
            }
            return e
        }

    }
    export class Fragment extends Group { }
}

declare global {
    namespace JSX {
        interface Element extends View { }
        interface ElementClass extends View { }
        interface ElementAttributesProperty {
            props: {};
        }
        interface ElementChildrenAttribute {
            innerElement: any;
        }
        interface IntrinsicElements { }
    }
}