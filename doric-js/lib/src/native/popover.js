import { Panel } from "../ui/panel";
export function popover(context) {
    const entity = context.entity;
    let panel = undefined;
    if (entity instanceof Panel) {
        panel = entity;
    }
    return {
        show: (view) => {
            if (panel) {
                panel.addHeadView("popover", view);
            }
            return context.callNative('popover', 'show', view.toModel());
        },
        dismiss: (view = undefined) => {
            if (panel) {
                if (view) {
                    panel.removeHeadView("popover", view);
                }
                else {
                    panel.clearHeadViews("popover");
                }
            }
            return context.callNative('popover', 'dismiss', view ? { id: view.viewId } : undefined);
        },
    };
}
