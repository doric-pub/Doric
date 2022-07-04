import { Group } from "../ui/view";
import { layoutConfig } from "./layoutconfig";
export var jsx;
(function (jsx) {
    function createElement(constructor, config, ...children) {
        if (!!constructor.isViewClass) {
            const e = new constructor();
            if (e instanceof Fragment) {
                return children;
            }
            e.layoutConfig = layoutConfig().fit();
            if (config) {
                e.apply(config);
            }
            if (children && children.length > 0) {
                if (children.length === 1) {
                    children = children[0];
                }
                if (Reflect.has(e, "innerElement")) {
                    Reflect.set(e, "innerElement", children, e);
                }
                else {
                    throw new Error(`Do not support ${constructor.name} for ${children}`);
                }
            }
            return e;
        }
        else {
            const f = constructor;
            const e = Reflect.apply(f, undefined, [config]);
            if (e instanceof Fragment) {
                return children;
            }
            if (children && children.length > 0) {
                if (children.length === 1) {
                    children = children[0];
                }
                if (Reflect.has(e, "innerElement")) {
                    Reflect.set(e, "innerElement", children, e);
                }
                else {
                    throw new Error(`Do not support add child for ${e.viewType()}`);
                }
            }
            return e;
        }
    }
    jsx.createElement = createElement;
    class Fragment extends Group {
    }
    jsx.Fragment = Fragment;
})(jsx || (jsx = {}));
