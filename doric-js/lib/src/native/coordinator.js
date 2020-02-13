var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { View } from "../ui/view";
import { Color } from "../util/color";
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
        verticalScrolling: (argument) => __awaiter(this, void 0, void 0, function* () {
            yield context.callNative("coordinator", "ready");
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
        })
    };
}
