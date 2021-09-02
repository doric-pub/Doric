import { Group, View } from "../ui/view";
import { layoutConfig } from "./layoutconfig";
export var jsx;
(function (jsx) {
    function addElement(group, v) {
        if (v instanceof Array) {
            v.forEach(e => addElement(group, e));
        }
        else if (v instanceof Fragment) {
            v.children.forEach(e => addElement(group, e));
        }
        else if (v instanceof View) {
            group.addChild(v);
        }
        else {
            throw new Error(`Can only use view as child`);
        }
    }
    function createElement(constructor, config, ...children) {
        const e = new constructor();
        e.layoutConfig = layoutConfig().fit();
        if (config) {
            e.apply(config);
        }
        if (children && children.length > 0) {
            if (e instanceof Group) {
                children.forEach((child) => {
                    addElement(e, child);
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
