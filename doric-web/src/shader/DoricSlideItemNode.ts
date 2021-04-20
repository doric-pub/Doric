import { DoricContext } from "../DoricContext";
import { DoricStackNode } from "./DoricStackNode";

export class DoricSlideItemNode extends DoricStackNode {
    constructor(context: DoricContext) {
        super(context)
        this.reusable = true
    }
    build() {
        const ret = super.build()
        ret.style.display = "inline-block"
        ret.style.width = "100%"
        ret.style.height = "100%"
        return ret
    }
}