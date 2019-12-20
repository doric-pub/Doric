import { DoricGroupViewNode, DVModel } from "./DoricViewNode";

export class DoricStackViewNode extends DoricGroupViewNode {

    build() {
        return document.createElement('div')
    }
    blend(props: { [index: string]: any }) {
        super.blend(props)
        this.childNodes.forEach(e => {
            e.view.style.position = "absolute"
        })
    }

}