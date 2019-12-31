import { DoricSuperNode, DVModel } from "./DoricViewNode";

export class DoricRefreshableNode extends DoricSuperNode {
    blendSubNode(model: DVModel) {

    }

    getSubNodeById(viewId: string) {
        return undefined
    }

    build() {
        const ret = document.createElement('div')
        return ret
    }


}