import { DoricSuperNode, DVModel, DoricViewNode } from "./DoricViewNode";
import { DoricListItemNode } from "./DoricListItemNode";

export class DoricListNode extends DoricSuperNode {
    itemCount = 0
    renderItemFuncId?: string
    onLoadMoreFuncId?: string
    loadMoreViewId?: string
    batchCount = 15
    loadMore = false
    childNodes: DoricListItemNode[] = []
    blendProps(v: HTMLParagraphElement, propName: string, prop: any) {
        switch (propName) {
            case "itemCount":
                this.itemCount = prop as number
                break
            case "renderItem":
                this.reset()
                this.renderItemFuncId = prop as string
                break
            case "onLoadMore":
                this.onLoadMoreFuncId = prop as string
                break
            case "loadMoreView":
                this.loadMoreViewId = prop as string
                break
            case "batchCount":
                this.batchCount = prop as number
                break
            case "loadMore":
                this.loadMore = prop as boolean
                break
            default:
                super.blendProps(v, propName, prop)
                break
        }
    }

    reset() {
        while (this.view.lastElementChild) {
            this.view.removeChild(this.view.lastElementChild)
        }
    }

    onBlended() {
        super.onBlended()
        if (this.childNodes.length !== this.itemCount) {
            const ret = this.callJSResponse("renderBunchedItems", 0, this.itemCount) as DVModel[]
            this.childNodes = ret.map(e => {
                const viewNode = DoricViewNode.create(this.context, e.type) as DoricListItemNode
                viewNode.viewId = e.id
                viewNode.init(this)
                viewNode.blend(e.props)
                this.view.appendChild(viewNode.view)
                return viewNode
            })
        }
    }
    blendSubNode(model: DVModel) {
        const viewNode = this.getSubNodeById(model.id)
        if (viewNode) {
            viewNode.blend(model.props)
        }
    }

    getSubNodeById(viewId: string) {
        return this.childNodes.filter(e => e.viewId === viewId)[0]
    }

    build() {
        const ret = document.createElement('div')
        ret.style.overflow = "scroll"
        return ret
    }
}