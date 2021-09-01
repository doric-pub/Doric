import { Group } from "../ui/view";
export const jsx = {
    createElement: function (constructor, config, ...children) {
        const e = new constructor();
        if (config) {
            for (let key in config) {
                Reflect.set(e, key, Reflect.get(config, key, config), e);
            }
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
