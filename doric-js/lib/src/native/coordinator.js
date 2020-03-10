import { View } from "../ui/view";
import { Color } from "../util/color";
import { Panel } from "../ui/panel";
function viewIdChains(view) {
    const viewIds = [];
    let thisView = view;
    while (thisView != undefined) {
        viewIds.push(thisView.viewId);
        thisView = thisView.superview;
    }
    return viewIds.reverse();
}
export function coordinator(context) {
    return {
        verticalScrolling: (argument) => {
            if (context.entity instanceof Panel) {
                const panel = context.entity;
                panel.onRenderFinished = () => {
                    argument.scrollable = viewIdChains(argument.scrollable);
                    if (argument.target instanceof View) {
                        argument.target = viewIdChains(argument.target);
                    }
                    if (argument.changing.start instanceof Color) {
                        argument.changing.start = argument.changing.start.toModel();
                    }
                    if (argument.changing.end instanceof Color) {
                        argument.changing.end = argument.changing.end.toModel();
                    }
                    return context.callNative("coordinator", "verticalScrolling", argument);
                };
            }
        }
    };
}
