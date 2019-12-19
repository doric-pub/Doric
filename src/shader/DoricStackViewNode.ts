import { DoricGroupViewNode, DVModel } from "./DoricViewNode";

export class DoricStackViewNode extends DoricGroupViewNode {

    build(): HTMLElement {
        return document.createElement('div')
    }

}