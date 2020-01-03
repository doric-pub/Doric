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
                panel.addHeadView(view);
            }
            return context.popover.show(view.toModel());
        },
        dismiss: (view = undefined) => {
            if (panel) {
                if (view) {
                    panel.removeHeadView(view);
                }
                else {
                    panel.clearHeadViews();
                }
            }
            return context.popover.dismiss(view ? { id: view.viewId } : undefined);
        },
    };
}
