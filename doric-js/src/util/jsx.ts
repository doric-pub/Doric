import { Group, View } from "../ui/view";
import { layoutConfig } from "./layoutconfig";
import { ClassType } from "./types";

export namespace jsx {
    export function createElement<T extends View>(
        constructor: ClassType<T>,
        config: Partial<T> | null,
        ...children: View[]
    ) {
        const e = new constructor();
        e.layoutConfig = layoutConfig().fit()
        if (config) {
            e.apply(config)
        }
        if (children && children.length > 0) {
            if (e instanceof Group) {
                children.forEach((child) => {
                    if (child instanceof Fragment) {
                        child.children.forEach(c => e.addChild(c))
                    } else {
                        e.addChild(child)
                    }
                });
            } else {
                throw new Error(
                    `Can only add child to group view, do not support ${constructor.name}`
                );
            }
        }
        return e;
    }
    export class Fragment extends Group { }
}

declare global {
    namespace JSX {
        interface IntrinsicElements { }
        interface ElementClass extends View { }
        interface ElementAttributesProperty {
            props: {};
        }
        interface ElementChildrenAttribute {
            children: View[];
        }
    }
}