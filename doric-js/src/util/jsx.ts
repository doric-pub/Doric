import { Group, View } from "../ui/view";
import { layoutConfig } from "./layoutconfig";
import { ClassType } from "./types";

export const jsx = {
    createElement: function <T extends View>(
        constructor: ClassType<T>,
        config: Partial<T> | null,
        ...children: View[]
    ): T {
        const e = new constructor();
        e.layoutConfig = layoutConfig().fit()
        if (config) {
            e.apply(config)
        }
        if (children && children.length > 0) {
            if (e instanceof Group) {
                children.forEach((child) => e.addChild(child));
            } else {
                throw new Error(
                    `Can only add child to group view, do not support ${constructor.name}`
                );
            }
        }
        return e;
    },
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