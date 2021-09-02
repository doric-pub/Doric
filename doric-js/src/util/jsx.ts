import { Group, View } from "../ui/view";
import { layoutConfig } from "./layoutconfig";
import { ClassType } from "./types";

export namespace jsx {
    function addElement(group: Group, v: any) {
        if (v instanceof Array) {
            v.forEach(e => addElement(group, e))
        } else if (v instanceof Fragment) {
            v.children.forEach(e => addElement(group, e))
        } else if (v instanceof View) {
            group.addChild(v)
        } else {
            throw new Error(
                `Can only use view as child`
            );
        }
    }

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
                    addElement(e, child)
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