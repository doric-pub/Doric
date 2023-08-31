import { DoricSuperNode, DVModel, DoricViewNode } from "./DoricViewNode";
import { DoricListItemNode } from "./DoricListItemNode";

export class DoricListNode extends DoricSuperNode {
    itemCount = 0
    renderItemFuncId?: string
    onLoadMoreFuncId?: string
    onScrollFuncId?: string
    loadMoreViewId?: string
    batchCount = 15
    loadMore = false
    childNodes: DoricListItemNode[] = []
    loadMoreViewNode?: DoricListItemNode
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
            case "onScroll":
                this.onScrollFuncId = prop as string
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
            case 'scrollable':
                v.style.overflow = prop ? 'scroll' : 'hidden'
                break
            default:
                super.blendProps(v, propName, prop)
                break
        }
    }

    reload() {
        this.reset()
        const ret = this.pureCallJSResponse("renderBunchedItems", 0, this.itemCount) as DVModel[]
        ret.forEach(e => {
            const viewNode = DoricViewNode.create(this.context, e.type) as DoricListItemNode
            viewNode.viewId = e.id
            viewNode.init(this)
            viewNode.blend(e.props)
            this.view.appendChild(viewNode.view)
            return viewNode
        })
    }

    reset() {
        while (this.view.lastElementChild) {
            this.view.removeChild(this.view.lastElementChild)
        }
        this.childNodes = []
    }

    onBlending() {
        super.onBlending()
        if (this.childNodes.length !== this.itemCount) {
            const ret = this.pureCallJSResponse("renderBunchedItems", this.childNodes.length, this.itemCount) as DVModel[]
            this.childNodes = this.childNodes.concat(ret.map(e => {
                const viewNode = DoricViewNode.create(this.context, e.type) as DoricListItemNode
                viewNode.viewId = e.id
                viewNode.init(this)
                viewNode.blend(e.props)
                this.view.appendChild(viewNode.view)
                return viewNode
            }))
        }
        if (this.loadMoreViewNode && this.view.contains(this.loadMoreViewNode.view)) {
            this.view.removeChild(this.loadMoreViewNode.view)
        }
        if (this.loadMore) {
            if (!this.loadMoreViewNode) {
                const loadMoreViewModel = this.getSubModel(this.loadMoreViewId || "")
                if (loadMoreViewModel) {
                    this.loadMoreViewNode = DoricViewNode.create(this.context, loadMoreViewModel.type) as DoricListItemNode
                    this.loadMoreViewNode.viewId = loadMoreViewModel.id
                    this.loadMoreViewNode.init(this)
                    this.loadMoreViewNode.blend(loadMoreViewModel.props)
                }
            }
            if (this.loadMoreViewNode) {
                this.view.appendChild(this.loadMoreViewNode.view)
            }
            if (this.view.scrollTop + this.view.offsetHeight === this.view.scrollHeight) {
                this.onScrollToEnd()
            }
        }
    }
    blendSubNode(model: DVModel) {
        this.getSubNodeById(model.id)?.blend(model.props)
    }

    getSubNodeById(viewId: string) {
        if (viewId === this.loadMoreViewId) {
            return this.loadMoreViewNode
        }
        return this.childNodes.filter(e => e.viewId === viewId)?.[0]
    }

    onScrollToEnd() {
        if (this.loadMore && this.onLoadMoreFuncId) {
            this.callJSResponse(this.onLoadMoreFuncId)
        }
    }

    build() {
        const ret = document.createElement('div')
        ret.style.overflow = "scroll"
        ret.addEventListener("scroll", event => {
            if (this.onScrollFuncId) {
                this.callJSResponse(this.onScrollFuncId,
                    { x: (event.target as HTMLElement).scrollLeft || 0, y: (event.target as HTMLElement).scrollTop })
            }
            if (this.loadMore) {
                if (ret.scrollTop + ret.offsetHeight === ret.scrollHeight) {
                    this.onScrollToEnd()
                }
            }
        })
        return ret
    }
    onBlended() {
        super.onBlended()
        this.childNodes.forEach(e => e.onBlended())
    }
}