import { Group } from "../ui/view";
import { layoutConfig } from "./layoutconfig";
export const jsx = {
    createElement: function (constructor, config, ...children) {
        const e = new constructor();
        e.layoutConfig = layoutConfig().fit();
        if (config) {
            e.apply(config);
        }
        if (children && children.length > 0) {
            if (e instanceof Group) {
                children.forEach((child) => e.addChild(child));
            }
            else {
                throw new Error(`Can only add child to group view, do not support ${constructor.name}`);
            }
        }
        return e;
    },
};
