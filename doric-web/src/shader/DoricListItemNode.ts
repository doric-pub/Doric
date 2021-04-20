import { DoricContext } from "../DoricContext";
import { DoricStackNode } from "./DoricStackNode";

export class DoricListItemNode extends DoricStackNode {
    constructor(context: DoricContext) {
        super(context)
        this.reusable = true
    }
}