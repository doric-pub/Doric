import { Gravity } from "../util/gravity";
export function modal(context) {
    return {
        toast: (msg, gravity = Gravity.Bottom) => {
            context.modal.toast({
                msg,
                gravity: gravity.toModel(),
            });
        },
        alert: (arg) => {
            if (typeof arg === 'string') {
                return context.modal.alert({ msg: arg });
            }
            else {
                return context.modal.alert(arg);
            }
        },
        confirm: (arg) => {
            if (typeof arg === 'string') {
                return context.modal.confirm({ msg: arg });
            }
            else {
                return context.modal.confirm(arg);
            }
        },
        prompt: (arg) => {
            return context.modal.prompt(arg);
        },
    };
}
