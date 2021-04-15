import { DoricSuperNode, DoricViewNode, DVModel } from "./DoricViewNode";

export class DoricRefreshableNode extends DoricSuperNode {

    headerViewId = ""
    headerNode?: DoricViewNode

    contentViewId = ""
    contentNode?: DoricViewNode

    onRefreshCallback?: Function

    headerContainer?: HTMLDivElement

    contentContainer?: HTMLDivElement

    build() {
        const ret = document.createElement('div')
        ret.style.overflow = "hidden"
        const header = document.createElement('div')
        const content = document.createElement('div')
        header.style.width = "100%"
        header.style.height = "100%"
        header.style.display = "flex"
        header.style.alignItems = "flex-end"
        header.style.justifyContent = "center"
        content.style.width = "100%"
        content.style.height = "100%"
        ret.appendChild(header)
        ret.appendChild(content)
        let touchStart = 0
        ret.ontouchstart = (ev) => {
            touchStart = ev.touches[0].pageY
        }
        ret.ontouchmove = (ev) => {
            ret.scrollTop = Math.max(0, header.offsetHeight - (ev.touches[0].pageY - touchStart))
        }
        ret.ontouchcancel = () => {
            ret.scrollTo({
                top: header.offsetHeight,
                behavior: "smooth"
            })
        }
        ret.ontouchend = () => {
            ret.scrollTo({
                top: header.offsetHeight,
                behavior: "smooth"
            })
        }
        window.requestAnimationFrame(() => {
            ret.scrollTop = header.offsetHeight
        })
        this.headerContainer = header
        this.contentContainer = content
        return ret
    }

    blendProps(v: HTMLElement, propName: string, prop: any) {
        if (propName === 'content') {
            this.contentViewId = prop
        } else if (propName === 'header') {
            this.headerViewId = prop
        } else if (propName === 'onRefresh') {
            this.onRefreshCallback = () => {
                this.callJSResponse(prop)
            }
        } else {
            super.blendProps(v, propName, prop)
        }
    }

    blendSubNode(model: DVModel) {
        this.getSubNodeById(model.id)?.blend(model.props)
    }

    getSubNodeById(viewId: string) {
        if (viewId === this.headerViewId) {
            return this.headerNode
        } else if (viewId === this.contentViewId) {
            return this.contentNode
        }
        return undefined
    }

    onBlending() {
        super.onBlending()
        {
            const headerModel = this.getSubModel(this.headerViewId)
            if (headerModel) {
                if (this.headerNode) {
                    if (this.headerNode.viewId !== this.headerViewId) {
                        if (this.reusable && this.headerNode.viewType === headerModel.type) {
                            this.headerNode.viewId = headerModel.id
                            this.headerNode.blend(headerModel.props)
                        } else {
                            this.headerContainer?.removeChild(this.headerNode.view)
                            const headerNode = DoricViewNode.create(this.context, headerModel.type)
                            if (headerNode) {
                                headerNode.viewId = headerModel.id
                                headerNode.init(this)
                                headerNode.blend(headerModel.props)
                                this.headerContainer?.appendChild(headerNode.view)
                                this.headerNode = headerNode
                            }
                        }
                    }
                } else {
                    const headerNode = DoricViewNode.create(this.context, headerModel.type)
                    if (headerNode) {
                        headerNode.viewId = headerModel.id
                        headerNode.init(this)
                        headerNode.blend(headerModel.props)
                        this.headerContainer?.appendChild(headerNode.view)
                        this.headerNode = headerNode
                    }
                }
            }
        }
        {
            const contentModel = this.getSubModel(this.contentViewId)
            if (contentModel) {
                if (this.contentNode) {
                    if (this.contentNode.viewId !== this.contentViewId) {
                        if (this.reusable && this.contentNode.viewType === contentModel.type) {
                            this.contentNode.viewId = contentModel.id
                            this.contentNode.blend(contentModel.props)
                        } else {
                            this.contentContainer?.removeChild(this.contentNode.view)
                            const contentNode = DoricViewNode.create(this.context, contentModel.type)
                            if (contentNode) {
                                contentNode.viewId = contentModel.id
                                contentNode.init(this)
                                contentNode.blend(contentModel.props)
                                this.contentContainer?.appendChild(contentNode.view)
                                this.contentNode = contentNode
                            }
                        }
                    }
                } else {
                    const contentNode = DoricViewNode.create(this.context, contentModel.type)
                    if (contentNode) {
                        contentNode.viewId = contentModel.id
                        contentNode.init(this)
                        contentNode.blend(contentModel.props)
                        this.contentContainer?.appendChild(contentNode.view)
                        this.contentNode = contentNode
                    }
                }
            }
        }
    }

    onBlended() {
        super.onBlended()
    }

    setRefreshing(v: boolean) {
        if (!this.headerContainer || !this.headerNode) {
            return
        }
        if (v) {
            this.view.scrollTo({
                top: this.headerContainer.offsetHeight - this.headerNode.getHeight(),
                behavior: "smooth"
            })
        } else {
            this.view.scrollTo({
                top: this.headerContainer?.offsetHeight,
                behavior: "smooth"
            })
        }
    }

    setRefreshable(v: boolean) {
        console.log("setRefreshable", v)
    }
}