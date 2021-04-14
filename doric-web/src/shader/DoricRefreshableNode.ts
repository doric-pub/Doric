import { DoricSuperNode, DVModel } from "./DoricViewNode";

export class DoricRefreshableNode extends DoricSuperNode {
    blendSubNode(model: DVModel) {

    }

    getSubNodeById(viewId: string) {
        return undefined
    }

    build() {
        const ret = document.createElement('div')
        ret.style.overflow = "scroll"
        const header = document.createElement('div')
        const content = document.createElement('div')
        header.style.width = "100%"
        header.style.height = "200px"
        header.style.backgroundColor = "red"

        content.style.width = "100%"
        content.style.height = "100%"
        content.style.backgroundColor = "blue"
        ret.appendChild(header)
        ret.appendChild(content)
        ret.addEventListener("scroll", () => {
            ret.scrollTop = 200
        })
        return ret
    }

}