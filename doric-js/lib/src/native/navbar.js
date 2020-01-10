import { Panel } from "../ui/panel";
export function navbar(context) {
    const entity = context.entity;
    let panel = undefined;
    if (entity instanceof Panel) {
        panel = entity;
    }
    return {
        isHidden: () => {
            return context.navbar.isHidden();
        },
        setHidden: (hidden) => {
            return context.navbar.setHidden({
                hidden,
            });
        },
        setTitle: (title) => {
            return context.navbar.setTitle({
                title,
            });
        },
        setBgColor: (color) => {
            return context.navbar.setBgColor({
                color: color.toModel(),
            });
        },
        setLeft: (view) => {
            if (panel) {
                panel.clearHeadViews("navbar_left");
                panel.addHeadView("navbar_left", view);
            }
            return context.navbar.setLeft(view.toModel());
        },
        setRight: (view) => {
            if (panel) {
                panel.clearHeadViews("navbar_right");
                panel.addHeadView("navbar_right", view);
            }
            return context.navbar.setRight(view.toModel());
        }
    };
}
