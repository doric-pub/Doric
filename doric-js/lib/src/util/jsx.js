import { Group } from "../ui/view";
import { layoutConfig } from "./layoutconfig";
export var jsx;
(function (jsx) {
    function createElement(constructor, config, ...children) {
        const e = new constructor();
        e.layoutConfig = layoutConfig().fit();
        if (config) {
            e.apply(config);
        }
        if (children && children.length > 0) {
            if (e instanceof Group) {
                children.forEach((child) => {
                    if (child instanceof Fragment) {
                        child.children.forEach(c => e.addChild(c));
                    }
                    else {
                        e.addChild(child);
                    }
                });
            }
            else {
                throw new Error(`Can only add child to group view, do not support ${constructor.name}`);
            }
        }
        return e;
    }
    jsx.createElement = createElement;
    class Fragment extends Group {
    }
    jsx.Fragment = Fragment;
})(jsx || (jsx = {}));
