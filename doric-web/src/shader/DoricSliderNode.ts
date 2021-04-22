import { DoricSlideItemNode } from "./DoricSlideItemNode";
import { DoricStackNode } from "./DoricStackNode";
import { DoricSuperNode, DoricViewNode, DVModel } from "./DoricViewNode";

export class DoricSliderNode extends DoricSuperNode {
    itemCount = 0
    renderPageFuncId = ""
    batchCount = 15
    onPageSelectedFuncId = ""
    loop = false
    childNodes: DoricSlideItemNode[] = []

    blendProps(v: HTMLElement, propName: string, prop: any) {
        if (propName === 'itemCount') {
            this.itemCount = prop
        } else if (propName === 'renderPage') {
            if (prop !== this.renderPageFuncId) {
                this.childNodes = []
                this.renderPageFuncId = prop
            }
        } else if (propName === 'batchCount') {
            this.batchCount = prop
        } else if (propName === 'onPageSlided') {
            this.onPageSelectedFuncId = prop
        } else if (propName === 'loop') {
            this.loop = prop
        } else {
            super.blendProps(v, propName, prop)
        }
    }

    blendSubNode(model: DVModel) {
        this.getSubNodeById(model.id)?.blend(model.props)
    }

    getSubNodeById(viewId: string) {
        return this.childNodes.filter(e => e.viewId === viewId)?.[0]
    }

    onBlending() {
        super.onBlending()
        if (this.childNodes.length !== this.itemCount) {
            const ret = this.pureCallJSResponse("renderBunchedItems", this.childNodes.length, this.itemCount) as DVModel[]
            this.childNodes = this.childNodes.concat(ret.map(e => {
                const viewNode = DoricViewNode.create(this.context, e.type) as DoricStackNode
                viewNode.viewId = e.id
                viewNode.init(this)
                viewNode.blend(e.props)
                this.view.appendChild(viewNode.view)
                return viewNode
            }))
        }
    }
    build() {
        const ret = document.createElement('div')
        ret.style.overflow = "hidden"
        ret.style.display = "inline"
        ret.style.whiteSpace = "nowrap"
        let touchStartX = 0
        let currentIndex = 0
        ret.ontouchstart = (ev) => {
            currentIndex = Math.round(ret.scrollLeft / ret.offsetWidth)
            touchStartX = ev.touches[0].pageX
        }
        ret.ontouchmove = (ev) => {
            const offsetX = (touchStartX - ev.touches[0].pageX) * 3
            ret.scrollTo({
                left: currentIndex * ret.offsetWidth + offsetX
            })
        }
        ret.ontouchcancel = ret.ontouchend = () => {
            let originInndex = currentIndex
            currentIndex = Math.round(ret.scrollLeft / ret.offsetWidth)
            ret.scrollTo({
                left: currentIndex * ret.offsetWidth,
                behavior: "smooth"
            })
            if (originInndex !== currentIndex) {
                if (this.onPageSelectedFuncId.length > 0) {
                    this.callJSResponse(this.onPageSelectedFuncId, currentIndex)
                }
            }
        }
        return ret
    }

    getSlidedPage() {
        return Math.round(this.view.scrollLeft / this.view.offsetWidth)
    }

    slidePage(params: { page: number, smooth: boolean }) {
        if (params.smooth) {
            this.view.scrollTo({
                left: this.view.offsetWidth * params.page,
                behavior: "smooth"
            })
        } else {
            this.view.scrollTo({
                left: this.view.offsetWidth * params.page
            })
        }
        if (this.onPageSelectedFuncId.length > 0) {
            this.callJSResponse(this.onPageSelectedFuncId, params.page)
        }
    }
}