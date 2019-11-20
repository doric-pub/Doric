import { BridgeContext } from "../runtime/global";
import { Gravity } from "./gravity";



export function modal(context: BridgeContext) {
    return {
        toast: (msg: string, gravity: Gravity = Gravity.Bottom) => {
            context.modal.toast({
                msg,
                gravity: gravity.toModel(),
            })
        },
    }
}