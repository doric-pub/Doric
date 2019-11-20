import { BridgeContext } from "../runtime/global";



export function modal(context: BridgeContext) {
    return {
        toast: (msg: string) => {
            context.modal.toast({ msg })
        },
    }
}