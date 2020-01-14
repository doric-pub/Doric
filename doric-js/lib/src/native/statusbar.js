export var StatusBarMode;
(function (StatusBarMode) {
    StatusBarMode[StatusBarMode["LIGHT"] = 0] = "LIGHT";
    StatusBarMode[StatusBarMode["DARK"] = 1] = "DARK";
})(StatusBarMode || (StatusBarMode = {}));
export function statusbar(context) {
    return {
        setHidden: (hidden) => {
            return context.statusbar.setHidden({ hidden });
        },
        setMode: (mode) => {
            return context.statusbar.setMode({ mode });
        },
        setColor: (color) => {
            return context.statusbar.setColor({ color: color.toModel() });
        },
    };
}
